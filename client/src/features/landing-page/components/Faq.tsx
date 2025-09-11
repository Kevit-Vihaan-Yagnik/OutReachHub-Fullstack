import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const FAQSection = ({ id }: { id?: string }) => {
  const theme = useTheme();

  const faqs = [
    {
      question: "What is OutReachHub?",
      answer:
        "OutReachHub is an all-in-one platform designed to help you connect, engage, and grow your audience with seamless integration and powerful tools.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply sign up for an account, choose a plan, and follow the setup guide to start using OutReachHub immediately.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes, we offer a 14-day free trial for all plans. No credit card required to get started.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "Yes, you can cancel your subscription anytime from your account dashboard with no penalties.",
    },
  ];

  return (
    <section id={id}>
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: "linear-gradient(135deg, #1e1e1e, #121212)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2))",
            backdropFilter: "blur(5px)",
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            px: { xs: 2, md: 4 },
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #00ffcc, #b300ff)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              "-webkit-text-fill-color": "transparent",
              mb: 4,
              textAlign: "center",
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Box>
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  background: "rgba(255, 255, 255, 0.05)",
                  mb: 2,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMore sx={{ color: theme.palette.text.primary }} />
                  }
                  sx={{ px: 2, py: 1 }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2, py: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Box>
    </section>
  );
};

export default FAQSection;
