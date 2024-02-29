import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Container,
  Box,
  Typography,
  IconButton,
  Button,
  Modal,
  TextField,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";

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

const EditProductModal = ({ open, handleClose, product, fetchProducts }) => {
  const [name, setName] = useState(product ? product.name : "");
  const [stock, setStock] = useState(product ? product.stock : "");

  useEffect(() => {
    setName(product ? product.name : "");
    setStock(product ? product.stock : "");
  }, [product]);

  const handleSave = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/products/${product.id}`, {
        name: name,
        stock: stock,
      });
      fetchProducts();
      handleClose();
      handleSnackbarOpen("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      handleSnackbarOpen("Failed to update product!");
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
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Edit Product
          </Typography>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            fullWidth
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

const AddProductModal = ({ open, handleClose, fetchProducts }) => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.post("http://127.0.0.1:8000/api/products", {
        name: name,
        stock: stock,
      });
      fetchProducts();
      handleClose();
      handleSnackbarOpen("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      handleSnackbarOpen("Failed to add product!");
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
          <Typography variant="h6">Add Product</Typography>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            fullWidth
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

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/products/${id}`
      );
      const productToEdit = response.data;
      setEditProduct(productToEdit);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching product for edit:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (confirmation) {
        await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
        handleSnackbarOpen("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      handleSnackbarOpen("Failed to delete product!");
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditProduct(null);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  return (
    <Container sx={{ width: "100%" }}>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Product
        </Button>
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
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Stock</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <StyledTableRow key={product.id}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell>{product.name}</StyledTableCell>
                <StyledTableCell>{product.stock}</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(product.id)}
                    sx={{ bgcolor: "Window" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(product.id)}
                    sx={{ bgcolor: "window" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditProductModal
        open={isEditModalOpen}
        handleClose={handleEditModalClose}
        product={editProduct}
        fetchProducts={fetchProducts}
      />

      <AddProductModal
        open={isAddModalOpen}
        handleClose={handleAddModalClose}
        fetchProducts={fetchProducts}
      />
    </Container>
  );
};

export default ProductPage;
