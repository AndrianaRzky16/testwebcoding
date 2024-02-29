import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Box, Typography, Button, Modal, Snackbar } from "@mui/material";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";

export const AddTransactionModal = ({
  open,
  handleClose,
  fetchTransactions,
  products,
  categories,
}) => {
  const [productName, setProductName] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setProductName("");
      setQuantitySold("");
      setTransactionDate("");
      setCategory("");
    }
  }, [open]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const soldQuantity = parseInt(quantitySold);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/transactions",
        {
          product_id: productName.id,
          jumlah_terjual: soldQuantity,
          tanggal_transaksi: transactionDate,
          categories_id: category.id,
        }
      );

      const { transaction, Product } = response.data;

      fetchTransactions();
      handleClose();
      handleSnackbarOpen("Transaction added successfully!");

      const handleSave = async () => {
        try {
          setSaving(true);
          const soldQuantity = parseInt(quantitySold);

          const response = await axios.post(
            "http://127.0.0.1:8000/api/transactions",
            {
              product_id: productName.id,
              jumlah_terjual: soldQuantity,
              tanggal_transaksi: transactionDate,
              categories_id: category.id,
            }
          );

          const { transaction, Product } = response.data;

          fetchTransactions();
          handleClose();
          handleSnackbarOpen("Transaction added successfully!");

          setProducts((prevProducts) => {
            return prevProducts.map((product) => {
              if (product.id === Product.id) {
                return Product;
              } else {
                return product;
              }
            });
          });
        } catch (error) {
          console.error("Error adding transaction:", error);
          handleSnackbarOpen("Failed to add transaction!");
        } finally {
          setSaving(false);
        }
      };
    } catch (error) {
      console.error("Error adding transaction:", error);
      handleSnackbarOpen("Failed to add transaction!");
    } finally {
      setSaving(false);
    }
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            borderRadius: 8,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Add Transaction</Typography>
          <Autocomplete
            value={productName}
            onChange={(event, newValue) => {
              setProductName(newValue);
            }}
            options={products}
            getOptionLabel={(option) => option?.name || ""}
            renderInput={(params) => (
              <TextField {...params} label="Product Name" fullWidth />
            )}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            value={quantitySold}
            onChange={(e) => setQuantitySold(e.target.value)}
            label="Quantity"
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            type="date"
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Autocomplete
            value={category}
            onChange={(event, newValue) => {
              setCategory(newValue);
            }}
            options={categories}
            getOptionLabel={(option) => option?.name || ""}
            renderInput={(params) => (
              <TextField {...params} label="Category" fullWidth />
            )}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Stock"
            fullWidth
            value={productName ? productName.stock : ""}
            disabled
            sx={{ marginBottom: 2 }}
          />

          <Button
            disabled={saving}
            onClick={handleSave}
            sx={{ marginTop: 2, backgroundColor: "#007bff", color: "white" }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};
