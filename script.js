createTable();

function addWord() {
  const word = document.getElementById("word").value.toUpperCase();
  const translation = document.getElementById("translation").value.toUpperCase();

  // Sprawdzamy, czy oba pola zostały uzupełnione
  if (word.trim() === "" || translation.trim() === "") {
    alert("Proszę wprowadzić słowo i tłumaczenie.");
    return;
  }

  // Pobieramy istniejące słowa z Local Storage
  var words = JSON.parse(localStorage.getItem("words")) || [];

  // Pobieramy indeks edytowanego słowa z Local Storage
  var editIndex = localStorage.getItem("editIndex");

  // Jeśli jest ustawiony indeks edytowanego słowa, nadpisujemy je
  if (editIndex !== null) {
    // Aktualizujemy słowo na podstawie indeksu
    words[editIndex] = {
      word: word,
      translation: translation
    };

    // Usuwamy indeks edytowanego słowa z Local Storage
    localStorage.removeItem("editIndex");

    alert("Słowo zostało zaktualizowane.");
  } else {
    // Tworzymy nowe słowo i dodajemy je do tablicy słów
    var newWord = {
      word: word,
      translation: translation
    };

    // Dodajemy nowe słowo do tablicy słów
    words.push(newWord);

    alert("Słowo zostało dodane do słownika.");
  }

  // Zapisujemy zaktualizowane słowa w Local Storage
  localStorage.setItem("words", JSON.stringify(words));

  // Czyścimy pola input
  document.getElementById("word").value = "";
  document.getElementById("translation").value = "";

  // Odświeżamy tabelę
  createTable();
}

function createTable() {
  document.getElementById("searchInput").style.visibility = "visible";
  document.getElementById("checkButton").style.visibility = "hidden";
  // Przypisanie funkcji shuffleTable() do zdarzenia kliknięcia przycisku "LOSUJ"
  document.getElementById("shuffleButton").addEventListener("click", shuffleTable);
  // Przypisanie funkcji createTable() do zdarzenia kliknięcia przycisku "WSZYSTKIE SŁÓWKA"
  document.getElementById("allButton").addEventListener("click", createTable);
  // Pobieramy istniejące słowa z Local Storage
  var words = JSON.parse(localStorage.getItem("words")) || [];

  // Pobieramy referencję do tabeli w HTML
  var table = document.getElementById("wordTable");

  // Czyścimy zawartość tabeli
  table.innerHTML = "";

  // Iterujemy przez słowa i tworzymy wiersze tabeli
  words.forEach(function (word, index) {
    // Tworzymy nowy wiersz tabeli
    var row = table.insertRow();

    // Dodajemy komórki do wiersza
    var idCell = row.insertCell();
    idCell.innerHTML = index + 1;

    var wordCell = row.insertCell();
    wordCell.innerHTML = word.word.toUpperCase();

    var translationCell = row.insertCell();
    translationCell.innerHTML = word.translation.toUpperCase();

    var actionsCell = row.insertCell();
    actionsCell.classList.add("actions-cell");

    var resultCell = row.insertCell();
    resultCell.classList.add("result");

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń";
    deleteButton.id = "deleteButton";
    deleteButton.addEventListener("click", function () {
      deleteWord(index);
    });
    actionsCell.appendChild(deleteButton);

    var editButton = document.createElement("button");
    editButton.textContent = "Edytuj";
    editButton.id = "editButton";
    editButton.addEventListener("click", function () {
      editWord(index);
    });
    actionsCell.appendChild(editButton);

    /*var hintButton = document.createElement("button");
    hintButton.textContent = "Uzupełnij";
    hintButton.id = "hintButton";
    //hintButton.style.visibility = "hidden";
    hintButton.addEventListener("click", function () {
      hintWord(index);
    });
    actionsCell.appendChild(hintButton);*/

    // Dodajemy inputy dla słowa i tłumaczenia
    var wordInput = document.createElement("input");
    wordInput.type = "text";
    wordInput.classList.add("word-input");
    wordInput.dataset.row = index;
    wordInput.style.display = "none";
    row.cells[1].appendChild(wordInput);

    var translationInput = document.createElement("input");
    translationInput.type = "text";
    translationInput.classList.add("translation-input");
    translationInput.dataset.row = index;
    translationInput.style.display = "none";
    row.cells[2].appendChild(translationInput);

  });
}

function deleteWord(index) {
  // Wyświetlamy potwierdzenie usuwania
  var confirmation = confirm("Czy na pewno chcesz usunąć to słowo?");

  // Jeśli użytkownik potwierdził usuwanie, wykonujemy dalsze działania
  if (confirmation) {
    // Pobieramy istniejące słowa z Local Storage
    var words = JSON.parse(localStorage.getItem("words")) || [];

    // Usuwamy słowo z tablicy na podstawie indeksu
    words.splice(index, 1);

    // Zapisujemy zaktualizowane słowa w Local Storage
    localStorage.setItem("words", JSON.stringify(words));

    // Odświeżamy tabelę
    createTable();
  }
}

function editWord(index) {
  // Pobieramy istniejące słowa z Local Storage
  var words = JSON.parse(localStorage.getItem("words")) || [];

  // Pobieramy słowo do edycji na podstawie indeksu
  var wordToEdit = words[index];

  // Ustawiamy wartości słowa do edycji w polach input
  document.getElementById("word").value = wordToEdit.word;
  document.getElementById("translation").value = wordToEdit.translation;

  // Zapisujemy zaktualizowane słowa w Local Storage
  localStorage.setItem("words", JSON.stringify(words));

  // Zapisujemy indeks edytowanego słowa w Local Storage
  localStorage.setItem("editIndex", index);

  // Zmieniamy napis na przycisku "Dodaj" na "Zapisz"
  document.getElementById("addButton").textContent = "Zapisz";
  createTable();
}

// Funkcja do losowego wymieszania danych w tabeli
function shuffleTable() {
  createTable();
  document.getElementById("searchInput").style.visibility = "hidden";
  document.getElementById("word").value = "";
  document.getElementById("translation").value = "";

  var table = document.getElementById("wordTable");
  var rows = Array.from(table.rows);
  var shuffledRows = shuffleArray(rows);

  shuffledRows.forEach(function (row, index) {
    var wordCell = row.cells[1];
    var translationCell = row.cells[2];

    if (index % 2 === 0) {
      var wordInput = document.createElement("input");
      wordInput.type = "text";
      wordInput.className = "word-input";
      wordInput.dataset.row = index;
      wordCell.textContent = "";
      wordCell.appendChild(wordInput);
      wordCell.classList.add("word-cell");
    } else {
      var translationInput = document.createElement("input");
      translationInput.type = "text";
      translationInput.className = "translation-input";
      translationInput.dataset.row = index;
      translationCell.textContent = "";
      translationCell.appendChild(translationInput);
      translationCell.classList.add("translation-cell");
    }
  });

  document.getElementById("checkButton").style.visibility = "visible";
}

// Funkcja do losowego tasowania tablicy
function shuffleArray(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

document.getElementById("searchInput").addEventListener("input", filterTable);
function filterTable() {
  var input = document.getElementById("searchInput").value.toUpperCase();
  var table = document.getElementById("wordTable");
  var rows = table.getElementsByTagName("tr");

  // Iterujemy przez wiersze tabeli (zaczynamy od indeksu)
  for (var i = 0; i < rows.length; i++) {
    var wordCell = rows[i].cells[1].textContent.toUpperCase();
    var translationCell = rows[i].cells[2].textContent.toUpperCase();

    // Sprawdzamy, czy wprowadzony tekst pasuje do słowa lub tłumaczenia
    if (wordCell.indexOf(input) > -1 || translationCell.indexOf(input) > -1) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}
function checkAnswers() {
  var table = document.getElementById("wordTable");
  var decision = document.getElementById("decisionCell");
  decision.style.visibility = "visible";
  for (var i = 0; i < table.rows.length; i++) {
    var row = table.rows[i];
    var wordCell = row.cells[1];
    var translationCell = row.cells[2];
    var decisionCell = row.cells[4];
    decisionCell.style.visibility = "visible";
    var wordInput = row.cells[1].querySelector("input.word-input");
    var translationInput = row.cells[2].querySelector("input.translation-input");
    var originalWord, originalTranslation;
    var enteredWord = wordInput.value.trim().toUpperCase(); // Wpisane słowo
    var enteredTranslation = translationInput.value.trim().toUpperCase(); // Wpisane tłumaczenie
    if (enteredWord) {

      console.log("Wpisane słowo: " + enteredWord);
      originalTranslation = translationCell.textContent.trim().toUpperCase(); // Oryginalne tłumaczenie z tabeli
      //console.log("Oryginalne tłumaczenie: " + originalTranslation);
      originalWord = getWord(originalTranslation); // Pobierz oryginalne słowo jeżeli wpisujesz słowo

      if (enteredWord === originalWord) {
        //console.log(enteredWord + originalWord + "green");
        decisionCell.style.backgroundColor = "green";
      } else {
        decisionCell.style.backgroundColor = "red";
      }
      if (!enteredWord || enteredWord === '') {
        console.log("Puste" + enteredWord);
        decisionCell.style.backgroundColor = "red";
      }
      //console.log("odpowiedź: " + originalWord);
      //console.log("Wpisane słowo: " + enteredWord + " Tłumaczenie: " + originalTranslation + "Odpowiedź: " + originalWord);
    } else {
      console.log("Nie znaleziono wordInput o podanym selektorze." + i);
    }

    if (enteredTranslation) {
      //console.log("jestem w translationInput");
      originalWord = wordCell.textContent.trim().toUpperCase(); // Oryginalne słowo z tabeli
      //console.log("Wpisane słowo: " + enteredTranslation);
      originalTranslation = getTranslation(originalWord); // Pobierz oryginalne tłumaczenie jeżeli wpisujesz tłumaczenie
      if (enteredTranslation === originalTranslation) {
        //console.log(enteredTranslation + originalTranslation + "green");
        decisionCell.style.backgroundColor = "green";
      } else {
        //console.log("red");
        decisionCell.style.backgroundColor = "red";
      }
      if (!enteredTranslation || enteredTranslation === '') {
        //console.log("Puste" + enteredTranslation);
        decisionCell.style.backgroundColor = "red";
      }
      //console.log("Słowo: " + originalWord + " Wpisane tłumaczenie: " + enteredTranslation + "Odpowiedź: " + originalTranslation);
    } else {
      //console.log("Nie znaleziono translationInput o podanym selektorze." + i);
    }

    if (enteredWord === '' && enteredTranslation === '') {
      decisionCell.style.backgroundColor = "red";
    }

  }
}

function getTranslation(word) {
  // Pobieramy istniejące słowa z Local Storage
  var words = JSON.parse(localStorage.getItem("words")) || [];

  // Przeszukujemy słowa w poszukiwaniu podanego słowa
  for (var i = 0; i < words.length; i++) {
    if (words[i].word.toUpperCase() === word.toUpperCase()) {
      return words[i].translation;
    }
  }

  // Jeżeli nie znaleziono tłumaczenia, zwracamy null lub możemy zwrócić domyślną wartość
  return null;
}

function getWord(translation) {
  // Pobieramy istniejące słowa z Local Storage
  var words = JSON.parse(localStorage.getItem("words")) || [];

  // Przeszukujemy słowa w poszukiwaniu podanego słowa
  for (var i = 0; i < words.length; i++) {
    if (words[i].translation.toUpperCase() === translation.toUpperCase()) {
      return words[i].word;
    }
  }

  // Jeżeli nie znaleziono tłumaczenia, zwracamy null lub możemy zwrócić domyślną wartość
  return null;
}

/*function hintWord(index) {
  var table = document.getElementById("wordTable");
  var row = table.rows[index];
  var wordCell = row.cells[1];
  var translationCell = row.cells[2];
  var wordInput = row.cells[1].querySelector("input.word-input");
  var translationInput = row.cells[2].querySelector("input.translation-input");
  var decisionCell = row.cells[4];
  decisionCell.style.backgroundColor = "yellow";

  if (wordInput && translationInput) {
    var wordValue = wordCell.textContent.trim().toUpperCase();
    var translationValue = translationCell.textContent.trim().toUpperCase();

    wordInput.value = wordValue;
    translationInput.value = translationValue;

  }
}*/






