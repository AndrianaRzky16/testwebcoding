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

const EditCategoryModal = ({
  open,
  handleClose,
  category,
  fetchCategories,
}) => {
  const [name, setName] = useState(category ? category.name : "");

  useEffect(() => {
    setName(category ? category.name : "");
  }, [category]);

  const handleSave = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/categories/${category.id}`, {
        name: name,
      });
      fetchCategories();
      handleClose();
      handleSnackbarOpen("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      handleSnackbarOpen("Failed to update category!");
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
            Edit Category
          </Typography>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{ marginLeft: 2 }}
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

const AddCategoryModal = ({ open, handleClose, fetchCategories }) => {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.post("http://127.0.0.1:8000/api/categories", {
        name: name,
      });
      fetchCategories();
      handleClose();
      handleSnackbarOpen("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      handleSnackbarOpen("Failed to add category!");
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
          <Typography variant="h6">Add Category</Typography>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button disabled={saving} onClick={handleSave}>
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

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      const responseData = response.data;

      if (Array.isArray(responseData)) {
        setCategories(responseData);
      } else {
        console.error("Error fetching categories: Response is not an array");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/categories/${id}`
      );
      const categoryToEdit = response.data;
      setEditCategory(categoryToEdit);
      setIsEditModalOpen(true);
      console.log("Category to edit:", response.data);
    } catch (error) {
      console.error("Error fetching category for edit:", error);
      handleSnackbarOpen("Failed to fetch category for edit!");
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditCategory(null);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this category?"
      );
      if (confirmation) {
        await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
        handleSnackbarOpen("Category deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      handleSnackbarOpen("Failed to delete category!");
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
          Categories
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Category
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
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <StyledTableRow key={category.id}>
                <StyledTableCell component="th" scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell>{category.name}</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(category.id)}
                    sx={{ bgcolor: "Window" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(category.id)}
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

      <EditCategoryModal
        open={isEditModalOpen}
        handleClose={handleEditModalClose}
        category={editCategory}
        fetchCategories={fetchCategories}
      />

      <AddCategoryModal
        open={isAddModalOpen}
        handleClose={handleAddModalClose}
        fetchCategories={fetchCategories}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default CategoryPage;
