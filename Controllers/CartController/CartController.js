const db = require("../../Config/db");
const { v4: uuidv4 } = require("uuid");

exports.createCart = (req, res) => {
  const { cid } = req.body;

  if (!cid) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  // You can use UUID for a unique cart_id
  const cartId = `cart_${Date.now()}`;
  const query = "INSERT INTO tbl_cart (cart_id, cid) VALUES (?, ?)";

  db.query(query, [cartId, cid], (err, result) => {
    if (err) {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(201)
      .json({ message: "Cart created successfully", cart_id: cartId });
  });
};

exports.getAllItemINCart = async (req, res, next) => {
  const id  = req.cid;

  const FindCart = "SELECT * FROM tbl_cart WHERE cid = ?";
  db.query(FindCart, [id], (err, result) => {
    if (err) {
      console.log(1);
      return res.status(500).json({ message: "Database error", error: err });
    } else if (result.length == 0) {
      console.log(2);
      const creatTebel = "insert into tbl_cart(cart_id,cid) values(?,?)";
      const cart_id = uuidv4();
      db.query(creatTebel, [cart_id, id], (err, result) => {
        if (err) {
          console.error(err); // Log error
          return res
            .status(500)
            .json({ message: "error on Createin card", error: err });
        }
        if (result) {
          console.log(3);
          console.log("create card");
          return res
            .status(201)
            .json({ message: "Cart created successfully", cart: [] });
        }
      });
    } else {
      const findCardItems = `
    SELECT ci.*, p.productname, p.price
    FROM tbl_cart_items ci
    JOIN tbl_retailer_products p ON ci.pid = p.pid
    WHERE ci.cart_id = ?
  `;

      db.query(findCardItems, [result[0].cart_id], (err, result) => {
        if (err) {
          console.error(err); // Log error
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        } else {
          console.log(5);
          return res.status(201).json({
            message: "succcessfully fetched card details",
            cart: result,
          });
        }
      });
    }
  });
};

exports.addItemToCart = (req, res) => {
  const {  pid, quantity } = req.body;
  const cid = req.cid;
  console.log(cid)
  console.log(req.body)


  const findCartidQuery = "SELECT cart_id  FROM tbl_cart WHERE cid = ?";

  db.query(findCartidQuery, [cid], (err, result) => {
    if ( !pid || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Cart ID, Product ID, and valid Quantity are required",
      });
    } else if (result.length == 0) {
      const creatTebel = "insert into tbl_cart(cart_id,cid) values(?,?)";
      const cart_id = uuidv4();
      console.log(1)
      db.query(creatTebel, [cart_id, cid], (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "error on Createin card",
            error: err,
          });
        }
        const cart_id = result[0].cart_id;
        console.log(result[0].cart_id)
        const checkProductQuery =
          "SELECT * FROM tbl_cart_items WHERE pid = ? and cart_id = ?";

        db.query(checkProductQuery, [pid, cart_id], (err, result) => {
          if (err) {
            console.error(err); // Log error
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }

          if (result.length !== 0) {
            return res
              .status(400)
              .json({ message: "Product already existed in card" });
          }

          if (result.length == 0) {
            const insertQuery =
              "INSERT INTO tbl_cart_items (cart_item_id, cart_id, pid, quantity) VALUES (?, ?, ?, ?)";

            db.query(
              insertQuery,
              [uuidv4(), cart_id, pid, quantity],
              (err, result) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ message: "Database error", error: err });
                }
                if (result) {
                  return res
                    .status(201)
                    .json({ message: "Product added to cart successfully" });
                }
              }
            );
          }
        });
      });
    } else {
      const cart_id = result[0].cart_id;
      const checkProductQuery =
        "SELECT * FROM tbl_cart_items WHERE pid = ? and cart_id = ?";
      db.query(checkProductQuery, [pid, cart_id], (err, result) => {
        if (err) {
          console.error(err); // Log error
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        if (result.length !== 0) {
          return res
            .status(400)
            .json({ message: "Product already existed in card" });
        }

        if (result.length == 0) {
          const insertQuery =
            "INSERT INTO tbl_cart_items (cart_item_id, cart_id, pid, quantity) VALUES (?, ?, ?, ?)";

          db.query(
            insertQuery,
            [uuidv4(), cart_id, pid, quantity],
            (err, result) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Database error", error: err });
              }
              if (result) {
                return res
                  .status(201)
                  .json({ message: "Product added to cart successfully" });
              }
            }
          );
        }
      });
    }
  });

  // Check if the cart exists
    // const checkCartQuery = "SELECT * FROM tbl_cart WHERE cart_id = ?";
    // db.query(checkCartQuery, [cart_id], (err, result) => {
    //   if (err) {
    //     console.error(err); // Log error
    //     return res.status(500).json({ message: "Database error", error: err });
    //   }

    //   if (result.length === 0) {
    //     return res.status(400).json({ message: "Cart ID does not exist" });
    //   }

    //   // Check if the product exists
    //   const checkProductQuery =
    //     "SELECT * FROM tbl_retailer_products WHERE pid = ?";
    //   db.query(checkProductQuery, [pid], (err, productResult) => {
    //     if (err) {
    //       console.error(err); // Log error
    //       return res.status(500).json({ message: "Database error", error: err });
    //     }

    //     if (productResult.length === 0) {
    //       return res.status(400).json({ message: "Product does not exist" });
    //     }

    //     // Add item to the cart
    //     const cartItemId = `item_${Date.now()}`;
    //     const insertQuery =
    //       "INSERT INTO tbl_cart_items (cart_item_id, cart_id, pid, quantity) VALUES (?, ?, ?, ?)";

    //     db.query(
    //       insertQuery,
    //       [cartItemId, cart_id, pid, quantity],
    //       (err, result) => {
    //         if (err) {
    //           console.error(err); // Log error
    //           return res
    //             .status(500)
    //             .json({ message: "Database error", error: err });
    //         }
    //         res.status(201).json({ message: "Item added to cart successfully" });
    //       }  
    //     );
    //   });   
    // }); 
};   

exports.getCartItems = (req, res) => {
  const { cart_id } = req.params; 

  const query = `
    SELECT ci.*, p.productname, p.price
    FROM tbl_cart_items ci
    JOIN tbl_retailer_products p ON ci.pid = p.pid
    WHERE ci.cart_id = ?
  `;

  db.query(query, [cart_id], (err, rows) => {
    if (err) {
      console.error(err); // Log error
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "No items found in this cart" });
    }

    res.status(200).json(rows);
  });
};
