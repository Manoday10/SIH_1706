function showFileName() {
  const fileInput = document.getElementById("pdf_file");
  const fileName = fileInput.files[0] ? fileInput.files[0].name : "";
  document.getElementById("fileName").innerText = fileName
    ? `Selected File: ${fileName}`
    : "";
}

function toggleLoading(show) {
  document.getElementById("spinner").style.display = show
    ? "block"
    : "none";
  document.getElementById("loadingText").style.display = show
    ? "block"
    : "none";
}

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
      showAlert("PDF Processed successfully");
  })
  .catch((error) => {
      document.getElementById("summary").innerText = "Error: " + error;
  })
  .finally(() => {
      toggleLoading(false);
  });
}

function summarizePdf(type) {
  const fileInput = document.getElementById("pdf_file");

  if (!fileInput.files.length) {
      alert("Please select a PDF file to summarize.");
      return;
  }

  toggleLoading(true);

  const formData = new FormData();
  formData.append("pdf_file", fileInput.files[0]);
  formData.append("summary_type", type);

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
      toggleLoading(false);
  });
}

function askQuestion() {
  const question = document.getElementById("question").value;

  if (!question) {
      alert("Please enter a question.");
      return;
  }

  toggleLoading(true);

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
      toggleLoading(false);
  });
}

function fetchOrgInfo() {
  let formData = new FormData();
  let fileInput = document.getElementById('pdf_file');
  
  if (fileInput.files.length === 0) {
      alert("Please upload a PDF file first.");
      return;
  }

  formData.append('pdf_file', fileInput.files[0]);

  toggleLoading(true);

  fetch('/fetch_org_info', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      if (data.error) {
          alert(data.error);
      } else {
          document.getElementById('orgInfo').innerText = data.orgInfo;
      }
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById('orgInfo').innerText = "Error: " + error;
  })
  .finally(() => {
      toggleLoading(false);
  });
}

function showAlert(message) {
    const alertElement = document.getElementById("alertMessage");
    alertElement.innerText = message;
    alertElement.classList.remove("hide");  
    alertElement.classList.add("show"); 

    setTimeout(() => {
        alertElement.classList.remove("show");
        alertElement.classList.add("hide");
    }, 3000);
}

function submitPdf() {
    const fileInput = document.getElementById("pdf_file");

    if (!fileInput.files.length) {
        alert("Please select a PDF file to upload.");
        return;
    }

    toggleLoading(true);

    const formData = new FormData();
    formData.append("pdf_file", fileInput.files[0]);

    fetch("/process_pdf", {
        method: "POST",
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        showAlert("PDF Processed successfully");
    })
    .catch((error) => {
        document.getElementById("summary").innerText = "Error: " + error;
    })
    .finally(() => {
        toggleLoading(false);
    });
}

function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.toggle("dark-mode"); 
  
    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.innerText = isDarkMode ? "Light Mode" : "Dark Mode";
  
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const darkModePreference = localStorage.getItem("darkMode");
    if (darkModePreference === "enabled") {
      document.body.classList.add("dark-mode");
      document.getElementById("darkModeToggle").innerText = "Light Mode";
    }
  });
  
