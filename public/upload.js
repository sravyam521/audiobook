document.getElementById('bookForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);

    // Upload the book
    const response = await fetch('/api/upload/book', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Book uploaded successfully!');

        // Ask if the user wants to upload more chapters
        if (confirm('Do you want to upload more chapters?')) {
            document.getElementById('chapterForm').style.display = 'block'; // Show chapter form
        }
    } else {
        alert('Error uploading book!');
    }
});

document.getElementById('chapterForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    // Upload the chapter
    const response = await fetch('/api/upload/chapter', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Chapter uploaded successfully!');
        
        // Ask if the user wants to upload more chapters
        if (confirm('Do you want to upload another chapter?')) {
            document.getElementById('book_id').value = '';
            document.getElementById('chapter_name').value = '';
            document.getElementById('chapter_number').value = '';
            document.getElementById('audio').value = '';
        } else {
            document.getElementById('chapterForm').style.display = 'none'; // Hide chapter form
        }
    } else {
        alert('Error uploading chapter!');
    }
});

 // Prompt user for password
 const correctPassword = "password"; // Set your desired password here
        
 const enteredPassword = prompt("Please enter the password to upload a book:");

 if (enteredPassword === correctPassword) {
     // Show the upload form if password is correct
     document.getElementById("uploadForm").style.display = "block";
 } else {
     alert("Incorrect password! You cannot access the upload page.");
     window.location.href = "index.html"; // Redirect back to the library page
 }