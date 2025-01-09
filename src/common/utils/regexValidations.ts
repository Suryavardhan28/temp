interface RegexObject {
	regex: RegExp;
	errorMessageKey: string;
}

export const phoneNumberRegex: RegexObject = {
	regex: /^[0-9]{10}$/,
	errorMessageKey: "phoneNumber",
};

export const accountNumberRegex: RegexObject = {
	regex: /^[0-9]{1,15}$/,
	errorMessageKey: "accountNumber",
};

export const alphanumeric10CharactersRegex: RegexObject = {
	regex: /^[A-Za-z0-9]{10}$/,
	errorMessageKey: "alphanumeric10Characters",
};

export const alphanumeric10CharactersOrLessRegex: RegexObject = {
	regex: /^[A-Za-z0-9]{0,10}$/,
	errorMessageKey: "alphanumeric10CharactersOrLess",
};

export const alphanumeric50CharactersOrLessRegex: RegexObject = {
	regex: /^[A-Za-z0-9]{0,50}$/,
	errorMessageKey: "alphanumeric50CharactersOrLess",
};

export const alphanumeric50CharactersOrLessWithSpacesRegex: RegexObject = {
	regex: /^[A-Za-z0-9 ]{1,50}$/,
	errorMessageKey: "alphanumeric50CharactersOrLessWithSpaces",
};

export const nonNumericWithSpaces50CharactersRegex: RegexObject = {
	regex: /^[A-Za-z ]{1,50}$/,
	errorMessageKey: "nonNumericWithSpaces50Characters",
};

export const emailRegex: RegexObject = {
	regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
	errorMessageKey: "email",
};

export const numericRegex: RegexObject = {
	regex: /^[0-9]+$/,
	errorMessageKey: "numeric",
};

export const max200CharactersRegex: RegexObject = {
	regex: /^.{0,200}$/,
	errorMessageKey: "max200Characters",
};

export const max100CharactersRegex: RegexObject = {
	regex: /^.{0,100}$/,
	errorMessageKey: "max100Characters",
};

export const min1max100CharactersRegex: RegexObject = {
	regex: /^.{1,100}$/,
	errorMessageKey: "min1max100Characters",
};

export const max25CharactersRegex: RegexObject = {
	regex: /^.{0,25}$/,
	errorMessageKey: "max25Characters",
};
