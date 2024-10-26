export function generateUniqueCode(fullName) {
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
  
    // Get the first 4 characters of the first name
    const shortName = firstName.slice(0, 2);
  
    // Generate a random 7-digit number
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
  
    // Combine to form the username
    const username = `${shortName}_${randomNumber}`;
    
    return username;
  }

  export function generateReferralCode(length=8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
  }

  export function generateRandomName() {
    const firstNames = [
      "Ahmed", "Fatima", "Mohammed", "Aisha", "Omar", "Zainab", "Ali", "Hafsa", "Ibrahim", "Maryam",
      "Abdullah", "Khadijah", "Yusuf", "Sumayya", "Bilal", "Mariam", "Hassan", "Hana", "Suleiman", "Sarah",
      "Ismail", "Lina", "Abdul Rahman", "Amina", "Zayd", "Saima", "Khalid", "Layla", "Imran", "Noor",
      "Huda", "Asad", "Rania", "Ammar", "Zahra", "Anas", "Mansoor", "Ruqayyah", "Musa", "Nadia",
      "Tariq", "Jannah", "Yahya", "Salma", "Hamza", "Safa", "Zaki", "Ayman", "Laila", "Nasir"
    ];
    
    const lastNames = [
      "Khan", "Hussain", "Ali", "Syed", "Sheikh", "Farooq", "Abbas", "Ansari", "Chaudhry", "Malik",
      "Ahmed", "Shaikh", "Mustafa", "Mahmood", "Qureshi", "Chishti", "Javed", "Rehman", "Shafi", "Hashmi",
      "Usmani", "Ghani", "Feroz", "Tariq", "Nawaz", "Zaman", "Sadiq", "Wahid", "Shah", "Rizvi",
      "Aziz", "Mirza", "Dar", "Bukhari", "Siddiqui", "Iqbal", "Ismail", "Hamid", "Shakir", "Mufti",
      "Shamsi", "Bajwa", "Kazmi", "Naeem", "Rauf", "Suleiman", "Zubair", "Latif", "Qadir", "Yousuf"
    ];
    
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${randomFirstName} ${randomLastName}`;
  }
  
  export function generateRandomTenDigitNumber() {
    const min = 1000000000;  // 10-digit minimum number
    const max = 9999999999;  // 10-digit maximum number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  export function generateRandomElevenDigitNumber() {
    const min = 10000000000;  // 11-digit minimum number
    const max = 99999999999;  // 11-digit maximum number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }