export function formatNumber(number) {
  // Convertir le nombre en chaîne
  var numStr = number.toString();

  // Séparateur des milliers (espace)
  var separator = " ";

  // Tableau pour stocker les parties fractionnaires et entières
  var parts = numStr.split(".");
  var integerPart = parts[0];
  var decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Insérer le séparateur des milliers dans la partie entière
  var formattedIntegerPart = "";
  for (var i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      formattedIntegerPart = separator + formattedIntegerPart;
    }
    formattedIntegerPart = integerPart[i] + formattedIntegerPart;
  }

  // Concaténer la partie entière formatée et la partie fractionnaire
  return formattedIntegerPart + decimalPart + " FC";
}
export function generateUniqueRandomNumbers(
  count: number,
  min: number,
  max: number
) {
  // Vérifier si le nombre demandé est valide
  if (count > max - min + 1) {
    throw new Error(
      "Le nombre demandé est supérieur au nombre de nombres uniques possibles."
    );
  }

  var uniqueNumbers = new Set();

  // Générer des nombres aléatoires uniques
  while (uniqueNumbers.size < count) {
    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    uniqueNumbers.add(randomNumber);
  }

  return Array.from(uniqueNumbers);
}
