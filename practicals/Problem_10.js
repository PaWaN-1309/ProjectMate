const fs = require('fs');

fs.writeFile('example.txt', 'This is the initial content.', 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File created and written successfully.');

  fs.appendFile('example.txt', '\nAppended line using appendFile.', (err) => {
    if (err) {
      console.error('Error appending file:', err);
      return;
    }
    console.log('Content appended successfully.');

    fs.readFile('example.txt', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }
      console.log('File contents:\n' + data);

      fs.rename('example.txt', 'renamed_example.txt', (err) => {
        if (err) {
          console.error('Error renaming file:', err);
          return;
        }
        console.log('File renamed successfully.');

        fs.unlink('renamed_example.txt', (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return;
          }
          console.log('File deleted successfully.');
        });
      });
    });
  });
});
