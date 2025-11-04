import xlsx from "xlsx";
import { pool } from "../../../config/database.js";
import { handleResponse } from "../../../utils/response.helper.js";

// Download products for logged-in user
export const productsDownloadByLoggedUserController = async (
  req,
  res,
  next
) => {
  try {
    const user_id = req.user.id;

    // Fetch products for the user
    const { rows: products } = await pool.query(
      `
      SELECT 
        p.unique_id AS product_id,
        p.name AS product_name,
        p.image,
        p.price,
        p.created_at,
        p.updated_at,
        c.unique_id AS category_id,
        c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.unique_id
      WHERE p.user_id = $1
      `,
      [user_id]
    );

    // Create workbook & sheet
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(products);
    xlsx.utils.book_append_sheet(workBook, workSheet, "products");

    // Generate file name with date
    const CurrentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Write file to buffer
    const buffer = xlsx.write(workBook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${CurrentDate}_products.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const uploadFileExcel = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const user_id = req.user.id;

    if (!req.file) {
      return handleResponse(res, 400, "No file uploaded");
    }

    // Read workbook from memory buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data.length) {
      return handleResponse(res, 400, "Uploaded file is empty");
    }

    await client.query("BEGIN");

    for (const row of data) {
      const { product_name, image, price, category_name } = row;

      if (!product_name || !price) continue;

      // Check if category exists for this user
      const { rows: existingCategory } = await client.query(
        `SELECT unique_id FROM categories WHERE name = $1 AND user_id = $2`,
        [category_name, user_id]
      );

      let category_id;

      if (existingCategory.length > 0) {
        category_id = existingCategory[0].unique_id;
      } else {
        //  Create new category
        const { rows: newCategory } = await client.query(
          `INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING unique_id`,
          [category_name, user_id]
        );
        category_id = newCategory[0].unique_id;
      }

      // Create product linked to that category
      await client.query(
        `
        INSERT INTO products (name, image, price, category_id, user_id)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [product_name, image || null, price, category_id, user_id]
      );
    }

    await client.query("COMMIT");

    return handleResponse(res, 201, "Products imported successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};
