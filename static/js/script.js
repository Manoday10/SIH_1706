function showFileName() {
    const fileInput = document.getElementById("pdf_file");
    const fileName = fileInput.files[0] ? fileInput.files[0].name : "";
    document.getElementById("fileName").innerText = fileName
      ? `Selected File: ${fileName}`
      : "";
  }

  // Function to show or hide the spinner and loading text
  function toggleLoading(show) {
    document.getElementById("spinner").style.display = show
      ? "block"
      : "none";
    document.getElementById("loadingText").style.display = show
      ? "block"
      : "none";
  }

  // Function to submit the PDF and process it
  function submitPdf() {
    const fileInput = document.getElementById("pdf_file");

    // Validate if a file is selected
    if (!fileInput.files.length) {
      alert("Please select a PDF file to upload.");
      return;
    }

    toggleLoading(true); // Show spinner and text

    const formData = new FormData();
    formData.append("pdf_file", fileInput.files[0]);

    fetch("/process_pdf", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("summary").innerText =
          "PDF Processed successfully";
      })
      .catch((error) => {
        document.getElementById("summary").innerText = "Error: " + error;
      })
      .finally(() => {
        toggleLoading(false); // Hide spinner and text
      });
  }

  // Function to summarize the PDF
  function summarizePdf() {
    const fileInput = document.getElementById("pdf_file");

    // Validate if a file is selected
    if (!fileInput.files.length) {
      alert("Please select a PDF file to summarize.");
      return;
    }

    toggleLoading(true); // Show spinner and text

    const formData = new FormData();
    formData.append("pdf_file", fileInput.files[0]);

    fetch("/summarize_pdf", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("summary").innerText =
          data.summary || data.error;
      })
      .catch((error) => {
        document.getElementById("summary").innerText = "Error: " + error;
      })
      .finally(() => {
        toggleLoading(false); // Hide spinner and text
      });
  }

  // Function to ask a question
  function askQuestion() {
    const question = document.getElementById("question").value;

    // Validate if a question is entered
    if (!question) {
      alert("Please enter a question.");
      return;
    }

    toggleLoading(true); // Show spinner and text

    fetch("/ask_question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("response").innerText =
          data.response || data.error;
      })
      .catch((error) => {
        document.getElementById("response").innerText = "Error: " + error;
      })
      .finally(() => {
        toggleLoading(false); // Hide spinner and text
      });
  }
