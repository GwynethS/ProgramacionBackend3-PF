const generateErrorInfo = (type, data) => {
  switch (type) {
    case "user":
      if (data.notFound) {
        return `User with ID ${data.id} was not found.`;
      }
      return `The provided user data is incomplete or invalid.
          Expected:
          - First Name: String, but received ${data.first_name}
          - Last Name: String, but received ${data.last_name}
          - Email: String, but received ${data.email}
          `;

    case "pet":
      if (data.notFound) {
        return `Pet with ID ${data.id} was not found.`;
      }
      return `The provided pet data is incomplete or invalid.
          Expected:
          - Name: String, but received ${data.name}
          - Specie: String, but received ${data.specie}
          - Birth Date: Date, but received ${data.birthDate}
          `;

    case "adoption":
      if (data.notFound) {
        return `Adoption with ID ${data.id} was not found.`;
      }
      return `The provided adoption data is incomplete or invalid.
          Expected:
          - Owner (User ID): ObjectId, but received ${data.owner}
          - Pet (Pet ID): ObjectId, but received ${data.pet}
          `;

    default:
      return "Unknown error type.";
  }
};

export default generateErrorInfo;
