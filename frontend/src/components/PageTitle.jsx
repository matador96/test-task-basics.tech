import Typography from "@mui/material/Typography";

const PageTitle = ({ children }) => {
  document.title = children;

  return <Typography variant="h3">{children}</Typography>;
};

export default PageTitle;
