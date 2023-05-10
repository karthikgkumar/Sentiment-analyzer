  function uploadCSV() {
    // Get the file input element
    const fileInput = document.getElementById("csv-file");
    
    // Get the CSV file
    const file = fileInput.files[0];
    
    // Check if the file is a CSV file
    if (file.type !== "text/csv") {
      alert("Please select a CSV file");
      return;
    }
    
    // Read the CSV file
    const reader = new FileReader();
    reader.onload = function(event) {
      const csvData = event.target.result;
      // Do something with the CSV data, such as parse and display it
      console.log(csvData);

       // Parse the CSV data
    const rows = csvData.split("\n");
    const headers = rows[0].split(",");
    console.log(headers)
    const reviewIndex = headers.indexOf("reviews\r") === -1 ? headers.indexOf("reviews\r") : headers.indexOf("review\r");
    console.log(headers.includes("review\r"))
       // Check if the CSV file has a "reviews" or "review" column
       if (reviewIndex === -1) {
        alert("The CSV file does not have a 'reviews' or 'review' column");
        return;
      }

       // Extract the review data
      const reviews = [];
      for (let i = 1; i < (rows.length-1); i++) {
        const cells = rows[i].split(",");
        reviews.push(cells[reviewIndex]);
    }


    // Do something with the review data, such as display it
    console.log(reviews);
    convertReviwes(reviews);
    };
    reader.readAsText(file);
  }

  function convertReviwes(arr){
    const reviews = arr.map(r => r.replaceAll('"', '').replaceAll("'", ''));
  analyzeReviews(reviews)
    .then(results => {
      for (const score of results) {
        if (score < 0) {
          console.log("neg");
        } else if (score === 0) {
          console.log("neutral");
        } else {
          console.log("positive");
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
  }
  
 
  async function analyzeReviews(reviews) {
    const batchSize = 50; // Maximum number of reviews to send in each batch
    const batches = [];
    for (let i = 0; i < reviews.length; i += batchSize) {
      const batch = reviews.slice(i, i + batchSize);
      batches.push(batch);
    }
    // Send each batch to the server and collect the results
  const results = [];
  for (const batch of batches) {
    const options = {
      method: 'POST',
      body: JSON.stringify({ r: batch }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    };

    const response = await fetch('/api/nlp/s-analyzer', options);
    const { analysis } = await response.json();
    results.push(...analysis);
  }

  return results;
}
