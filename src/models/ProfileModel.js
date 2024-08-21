const emailRegex = /^\S+@\S+\.\S+$/;
class ProfileModel {
  constructor() {
    this.uuid = null;
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.password = null;
    this.profileImageUrl = null;
  }
  isValid() {
    return (
      this.firstName.length >= 3 &&
      this.lastName.length >= 3 &&
      this.email.match(emailRegex) &&
      this.password.length >= 6
    );
  }
}

export default ProfileModel;
