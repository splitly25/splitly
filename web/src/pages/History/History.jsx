import Layout from "~/components/Layout";
import { useEffect, useState } from "react";
import { fetchHistoryDataAPI } from "~/apis";
import {
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Checkbox,
  Avatar,
  AvatarGroup,
  InputAdornment,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const History = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);

  const tableHeader = [
    { id: 1, title: "Ngày thanh toán" },
    { id: 2, title: "Tên hóa đơn" },
    { id: 3, title: "Số tiền" },
    { id: 4, title: "Người ứng tiền" },
    { id: 5, title: "Người tham gia" },
    { id: 6, title: "Đã quyết toán" },
  ];

  // For now, using a hardcoded user ID - this should come from authentication context
  const currentUserId = "69097a08cfc3fcbcfb0f5b72"; // This should be from auth context

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);

        const responeData = await fetchHistoryDataAPI(currentUserId, 1, 10, "");
        setHistoryData(responeData.bills);
        setTotalPage(responeData.pagination.totalPages);
        console.log(responeData);

        setError(null);
      } catch (err) {
        console.log("Error fetching history data", err);
        setError("Failed to load history data");
      } finally {
        setLoading(false);
      }
    };
    fetchHistoryData();
  }, [currentUserId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const formatDate = (timestamp) => {
    if(!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('vi-VN');
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <Layout>
      <Box className="p-3 sm:p-4 md:p-6 lg:p-10 min-h-screen bg-white">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#574D98] mb-4 sm:mb-6 md:mb-8">
          Danh sách hóa đơn
        </h1>

        <Box className="mb-4 sm:mb-5 md:mb-6 bg-white rounded-2xl shadow-sm p-3 sm:p-4 md:p-6">
          <Box className="flex gap-3 items-center">
            <TextField
              fullWidth
              placeholder="Ngày thanh toán, tên hóa đơn, etc..."
              value={searchText}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: "#9CA3AF",
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#F9FAFB",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  "& fieldset": {
                    borderColor: "#E5E7EB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D1D5DB",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#574D98",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: { xs: "6px 8px", sm: "8px 12px", md: "8.5px 14px" },
                },
              }}
            />
            <IconButton
              sx={{
                color: "#574D98",
                backgroundColor: "#F3F4F6",
                "&:hover": {
                  backgroundColor: "#E5E7EB",
                },
                borderRadius: "8px",
                padding: { xs: "6px", sm: "8px" },
              }}
            >
              <FilterListIcon
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              />
            </IconButton>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: { xs: "12px", md: "16px" },
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            overflow: "auto",
            maxWidth: "100%",
          }}
        >
          <Table sx={{ minWidth: { xs: 600, sm: 700, md: 800 } }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F8B4B4" }}>
                {tableHeader.map((column) => (
                  <TableCell
                    key={column.id}
                    align={
                      column.id === 4 ? "left" : "center"
                    }
                    sx={{
                      color: "#1F2937",
                      fontWeight: 600,
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.8rem",
                        md: "0.875rem",
                        lg: "0.95rem",
                      },
                      padding: {
                        xs: "8px 4px",
                        sm: "10px 8px",
                        md: "12px 16px",
                      },
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column.title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((bill, index) => (
                <TableRow
                  key={bill.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#FFF" : "#FCE7E7",
                    "&:hover": {
                      backgroundColor: index % 2 === 0 ? "#FEF2F2" : "#FCD5D5",
                    },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      color: "#374151",
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.75rem",
                        md: "0.875rem",
                        lg: "1rem",
                      },
                      padding: {
                        xs: "6px 4px",
                        sm: "8px 8px",
                        md: "12px 16px",
                      },
                    }}
                  >
                    {formatDate(bill.paymentDate)}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#374151",
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.75rem",
                        md: "0.875rem",
                        lg: "1rem",
                      },
                      padding: {
                        xs: "6px 4px",
                        sm: "8px 8px",
                        md: "12px 16px",
                      },
                    }}
                  >
                    {bill.billName}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#374151",
                      fontWeight: 500,
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.75rem",
                        md: "0.875rem",
                        lg: "1rem",
                      },
                      padding: {
                        xs: "6px 4px",
                        sm: "8px 8px",
                        md: "12px 16px",
                      },
                    }}
                  >
                    {formatCurrency(bill.totalAmount)}đ
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: {
                        xs: "6px 4px",
                        sm: "8px 8px",
                        md: "12px 16px",
                      },
                    }}
                  >
                    <Box className="flex items-center justify-start gap-1 sm:gap-2">
                      <Avatar
                        sx={{
                          width: { xs: 24, sm: 28, md: 32 },
                          height: { xs: 24, sm: 28, md: 32 },
                          backgroundColor: "#D1D5DB",
                          color: "#6B7280",
                          fontSize: {
                            xs: "0.65rem",
                            sm: "0.75rem",
                            md: "0.875rem",
                          },

                        }}
                      >
                        {bill.payer.name.charAt(0)}
                      </Avatar>
                      <span
                        className="text-gray-700"
                        style={{
                          fontSize: "clamp(0.65rem, 2vw, 1rem)",
                        }}
                      >
                        {bill.payer.name}
                      </span>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: {
                        xs: "6px 4px",
                        sm: "8px 8px",
                        md: "12px 16px",
                      },
                    }}
                  >
                    <AvatarGroup
                      className="flex justify-center "
                      max={3}
                      sx={{
                        "& .MuiAvatar-root": {
                          width: { xs: 24, sm: 28, md: 32 },
                          height: { xs: 24, sm: 28, md: 32 },
                          fontSize: {
                            xs: "0.65rem",
                            sm: "0.75rem",
                            md: "0.875rem",
                          },
                          backgroundColor: "#D1D5DB",
                          color: "#6B7280",
                        },
                      }}
                    >
                      {bill.participants.map((participant, idx) => (
                        <Avatar key={idx}>{participant.name.charAt(0)}</Avatar>
                      ))}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      padding: {
                        xs: "6px 4px",
                        sm: "8px 8px",
                        md: "12px 16px",
                      },
                    }}
                  >
                    <Checkbox
                      checked={bill.settled}
                      sx={{
                        color: "#D1D5DB",
                        padding: { xs: "4px", sm: "6px", md: "9px" },
                        "& .MuiSvgIcon-root": {
                          fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                        },
                        "&.Mui-checked": {
                          color: "#574D98",
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box className="flex justify-center mt-4 sm:mt-6 md:mt-8">
          <Pagination
            count={totalPage}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="small"
            siblingCount={{ xs: 0, sm: 1 }}
            boundaryCount={{ xs: 1, sm: 1 }}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#6B7280",
                fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
                minWidth: { xs: "24px", sm: "28px", md: "32px" },
                height: { xs: "24px", sm: "28px", md: "32px" },
                margin: { xs: "0 2px", sm: "0 3px" },
                "&.Mui-selected": {
                  backgroundColor: "#374151",
                  color: "#FFF",
                  "&:hover": {
                    backgroundColor: "#1F2937",
                  },
                },
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                },
              },
            }}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default History;
