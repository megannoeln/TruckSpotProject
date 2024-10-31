const currentDate = new Date().toISOString();

class Vendor{
    
    constructor(strFirstName, strLastName,strEmail, strPhone, strPassword, dtDateCreated, dtLastLogin){
        this.strFirstName = strFirstName,
        this.strLastName = strLastName,
        this.strEmail = strEmail,
        this.strPhone = strPhone,
        this.strPassword = strPassword,
        this.dtDateCreated = currentDate,
        this.dtLastLogin = currentDate
    }
}

module.exports = Vendor;
