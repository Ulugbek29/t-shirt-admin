export const paymentTypes = (paymentId) => {
    let paymentType = "";
    switch (paymentId) {
      case "8e85e55f-bcd8-4225-9ae9-ec9ded4787ae":
        paymentType = "Cash";
        break;
      case "f2868b77-32b2-4f0b-be9f-710741c386d5":
        paymentType = "Payme";
        break;
      case "d19c17c2-902f-4751-8c34-0e2c8bf20a60":
        paymentType = "Click";
        break;
      default: 
        paymentType = "";
    }
    return paymentType;
  };