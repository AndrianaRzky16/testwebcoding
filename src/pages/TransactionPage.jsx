import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

import {
  Container,
  Box,
  Typography,
  IconButton,
  Button,
  Modal,
  Snackbar,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hoverOpacity,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const EditTransactionModal = ({
  open,
  handleClose,
  transaction,
  fetchTransactions,
  products,
  categories,
  setProducts,
}) => {
  const [product, setProduct] = useState(null);
  const [quantitySold, setQuantitySold] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (transaction) {
      const selectedProduct = products.find(
        (p) => p.id === transaction.product_id
      );
      setProduct(selectedProduct);
      setQuantitySold(transaction.jumlah_terjual);
      setTransactionDate(transaction.tanggal_transaksi);
      setCategory(transaction.categories_id);
    }
  }, [transaction, products]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const difference = quantitySold - transaction.jumlah_terjual;

      const transactionUpdateResponse = await axios.put(
        `http://127.0.0.1:8000/api/transactions/${transaction.id}`,
        {
          product_id: product.id,
          jumlah_terjual: quantitySold,
          tanggal_transaksi: transactionDate,
          categories_id: category.id,
        }
      );

      const updatedTransaction = transactionUpdateResponse.data.transaction;

      const updatedProduct = await axios.get(
        `http://127.0.0.1:8000/api/products/${updatedTransaction.product_id}`
      );
      const updatedStock = updatedProduct.data.stock;

      setProducts(
        products.map((p) => {
          if (p.id === updatedTransaction.product_id) {
            return { ...p, stock: updatedStock };
          }
          return p;
        })
      );

      fetchTransactions();
      handleClose();
      handleSnackbarOpen("Transaction updated successfully!");
    } catch (error) {
      console.error("Error updating transaction:", error);
      handleSnackbarOpen("Failed to update transaction!");
    } finally {
      setSaving(false);
    }
  };

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
        {/* Modal content */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Edit Transaction
          </Typography>
          <Autocomplete
            value={product}
            onChange={(event, newValue) => {
              setProduct(newValue);
            }}
            options={products}
            getOptionLabel={(option) => option?.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Product Name"
                fullWidth
                value={product ? product.name : ""}
              />
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
            label="Transaction Date"
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

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                marginLeft: 2,
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
              }}
            >
              Save
            </Button>
            <Button
              onClick={handleClose}
              variant="contained"
              color="secondary"
              sx={{ marginLeft: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

const AddTransactionModal = ({
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

          setProductName((prevProducts) => {
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
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
    fetchCategories();
    handleSortTransactions();
  }, [sortBy]);

  const handleSortTransactions = async () => {
    try {
      let response;
      if (sortBy === "name") {
        response = await axios.get("/api/transactions/sort?sortBy=name");
      } else if (sortBy === "tanggal_transaksi") {
        response = await axios.get(
          "/api/transactions/sort?sortBy=tanggal_transaksi"
        );
      }
      setTransactions(response.data);
    } catch (error) {
      console.error("Error sorting transactions:", error);
    }
  };

  const handleSearching = async (e) => {
    setSearchQuery(e.target.value);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/transactions/search?search=${e.target.value}`
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error searching transactions:", error);
    }
  };

  const handleCompareSales = async (type) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/transactions/compare-sales?type=${type}`
      );
      console.log("Comparison result:", response.data);
    } catch (error) {
      console.error("Error comparing sales:", error);
    }
  };

  const handleCompareSalesByDate = async (type) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/transactions/compare-sales-by-date?type=${type}&start_date=${startDate}&end_date=${endDate}`
      );
      console.log("Comparison result by date:", response.data);
    } catch (error) {
      console.error("Error comparing sales by date:", error);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/transactions"
      );
      setTransactions(response.data);
      console.log("Transactions fetched successfully!");
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/transactions/${id}`
      );
      const transactionToEdit = response.data;
      const category = categories.find(
        (c) => c.id === transactionToEdit.categories_id
      );
      const product = products.find(
        (p) => p.id === transactionToEdit.products_id
      );
      transactionToEdit.categories_id = category;
      transactionToEdit.products_id = product;
      setEditTransaction(transactionToEdit);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching transaction for edit:", error);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditTransaction(null);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (confirmation) {
        await axios.delete(`http://127.0.0.1:8000/api/transactions/${id}`);
        setTransactions(
          transactions.filter((transaction) => transaction.id !== id)
        );
        handleSnackbarOpen("Transaction deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      handleSnackbarOpen("Failed to delete transaction!");
    }
  };

  const getProductInfoById = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "N/A";
  };

  const getCategoryNameById = (categoryId) => {
    if (!categoryId) return "N/A";

    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "N/A";
  };

  const getStockById = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.stock : "N/A";
  };

  const getCategoryById = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "N/A";
  };

  return (
    <Container sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
          flexDirection: "row",
        }}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{ fontWeight: "bold", flex: 1 }}
        >
          Transactions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ marginLeft: 2 }}
        >
          Add Transaction
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Search TextField */}
        <TextField
          placeholder="Search"
          variant="filled"
          size="small"
          value={searchQuery}
          onChange={handleSearching}
          sx={{
            marginBottom: "10px",
            alignItems: "center",
            width: "100%",
            marginRight: 5,
            color: "white",
          }}
          InputLabelProps={{
            style: { color: "white" },
          }}
          InputProps={{
            style: { color: "white" },
          }}
        />
        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={handleSortChange}
          variant="outlined"
          size="small"
          sx={{ minWidth: 120, marginBottom: "10px", color: "white" }}
          InputLabelProps={{
            style: { color: "white" },
          }}
          InputProps={{
            style: { color: "white" },
          }}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="tanggal_transaksi">Transaction Date</MenuItem>
        </TextField>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          margin: "auto",
          marginBottom: "20px",
          borderRadius: "10px",
        }}
      >
        <Table
          sx={{
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
            tableLayout: "fixed",
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>No.</StyledTableCell>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Stock</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>Transaction Date</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(transactions) &&
              transactions.map((transaction, index) => (
                <StyledTableRow key={transaction.id}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>
                    {getProductInfoById(transaction.product_id)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {getStockById(transaction.product_id)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {transaction.jumlah_terjual}
                  </StyledTableCell>
                  <StyledTableCell>
                    {transaction.tanggal_transaksi}
                  </StyledTableCell>
                  <StyledTableCell>
                    {getCategoryNameById(transaction.categories_id)}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(transaction.id)}
                      sx={{ bgcolor: "Window" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(transaction.id)}
                      sx={{ bgcolor: "window" }}
                    >
                      <DeleteIcon />
                    </IconButton>{" "}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditTransactionModal
        open={isEditModalOpen}
        handleClose={handleEditModalClose}
        transaction={editTransaction}
        fetchTransactions={fetchTransactions}
        products={products}
        categories={categories}
        setProducts={setProducts}
        handleSnackbarOpen={handleSnackbarOpen}
      />

      <AddTransactionModal
        open={isAddModalOpen}
        handleClose={handleAddModalClose}
        fetchTransactions={fetchTransactions}
        setProducts={setProducts}
        products={products}
        categories={categories}
        handleSnackbarOpen={handleSnackbarOpen}
      />
    </Container>
  );
};

export default TransactionPage;
