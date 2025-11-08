import Layout from "~/components/Layout";
import { useEffect, useState } from "react";
import { fetchHistoryDataAPI, fetchHistorySearchingAPI } from "~/apis";
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
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const History = () => {
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [totalBills, setTotalBills] = useState(0);

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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1); // Reset to page 1 when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchText]);

  // Fetch history data when page or search changes
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);

        // Use search endpoint if there's a search term, otherwise use regular endpoint
        const responseData = debouncedSearch 
          ? await fetchHistorySearchingAPI(
              currentUserId, 
              page, 
              10, 
              debouncedSearch, 
              ""
            )
          : await fetchHistoryDataAPI(
              currentUserId, 
              page, 
              10, 
              "", 
              ""
            );
        
        setHistoryData(responseData.bills || []);
        setTotalPage(responseData.pagination?.totalPages || 1);
        setTotalBills(responseData.pagination?.total || 0);

        setError(null);
      } catch (err) {
        console.error("Error fetching history data", err);
        setError("Failed to load history data");
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistoryData();
  }, [currentUserId, page, debouncedSearch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const formatDate = (timestamp) => {
    if(!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('vi-VN');
  }

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchClear = () => {
    setSearchText("");
    setDebouncedSearch("");
    setPage(1);
  };

  if (error) {
    return (
      <Layout>
        <Box className="p-6 md:p-10 min-h-screen bg-white flex items-center justify-center">
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      </Layout>
    );
  }


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
              placeholder="Tìm kiếm theo tên hóa đơn, mô tả, ngày tháng năm..."
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

        {/* Search Results Info */}
        {debouncedSearch && (
          <Box className="mb-4 flex items-center gap-2">
            <Typography variant="body2" color="text.secondary">
              Tìm thấy <strong>{totalBills}</strong> kết quả cho "{debouncedSearch}"
            </Typography>
            {searchText && (
              <IconButton 
                size="small" 
                onClick={handleSearchClear}
                sx={{ color: '#574D98' }}
              >
                ✕
              </IconButton>
            )}
          </Box>
        )}

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: { xs: "12px", md: "16px" },
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
            overflow: "auto",
            maxWidth: "100%",
            minHeight: loading ? "400px" : "auto",
            position: "relative",
          }}
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                zIndex: 10,
              }}
            >
              <CircularProgress sx={{ color: "#574D98" }} />
            </Box>
          )}

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
              {!loading && historyData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box className="flex flex-col items-center gap-3">
                      <SearchIcon sx={{ fontSize: 64, color: "#D1D5DB" }} />
                      <Typography variant="h6" color="text.secondary">
                        {debouncedSearch 
                          ? `Không tìm thấy hóa đơn cho "${debouncedSearch}"`
                          : "Không có hóa đơn nào"
                        }
                      </Typography>
                      {debouncedSearch && (
                        <Typography variant="body2" color="text.secondary">
                          Thử tìm kiếm với từ khóa khác
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                historyData.map((bill, index) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination - Only show if there are results */}
        {!loading && historyData.length > 0 && totalPage > 1 && (
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
        )}
      </Box>
    </Layout>
  );
};

export default History;