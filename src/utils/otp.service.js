const otpService = () => {
    let randomNumbers = Array.from({length: 6}, () => Math.ceil(Math.random() * 9)).join("");
    let otpTime = Date.now() + 2 * 60 * 1000;
    return {otp: randomNumbers, otpTime}
}

export default otpService;