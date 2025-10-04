import {decryptAES, encryptAES} from "../utils/AESEncryption.js";

export function decryptAddress(address = {}) {
    return {
        ...address,
        street: decryptAES(address.street),
        city: decryptAES(address.city),
        state: decryptAES(address.state),
        zip: decryptAES(address.zip),
        country: decryptAES(address.country),
    };
}

export function decryptPerson(person = {}) {
    return {
        ...person,
        firstName: decryptAES(person.firstName),
        lastName: decryptAES(person.lastName),
        phone: decryptAES(person.phone),
        address: decryptAddress(person.address),
    };
}

export function decryptIncident(incident = {}) {
    return {
        ...incident,
        description: decryptAES(incident.description),
        address: decryptAddress(incident.address),
        crimetype: decryptAES(incident.crimetype
        ),
    };
}

export function decryptComplaint(complaint) {
    return {
        ...complaint,
        victim: decryptPerson(complaint.victim),
        accused: decryptPerson(complaint.accused),
        incidence: decryptIncident(complaint.incidence),
        evidenceLink: complaint.evidenceLink,

    };
}


export function encryptAddress(address = {}) {
    return {
        ...address,
        street: encryptAES(address.street),
        city: encryptAES(address.city),
        state: encryptAES(address.state),
        zip: encryptAES(address.zip),
        country: encryptAES(address.country),
    };
}

export function encryptPerson(person = {}) {
    return {
        ...person,
        firstName: encryptAES(person.firstName),
        lastName: encryptAES(person.lastName),
        phone: encryptAES(person.phone),
        address: encryptAddress(person.address),
    };
}

export function encryptIncident(incident = {}) {
    return {
        ...incident,
        description: encryptAES(incident.description),
        address: encryptAddress(incident.address),
    };
}

export function encryptComplaint(complaint) {
    return {
        ...complaint,
        victim: encryptPerson(complaint.victim),
        accused: encryptPerson(complaint.accused),
        incidence: encryptIncident(complaint.incidence),
        evidenceLink: complaint.evidenceLink, // decrypt if encrypted
    };
}

export function decryptuser(user){
    return{
        ...user,
        firstName: decryptAES(user.firstName),
        lastName: decryptAES(user.lastName),
        aadharNumber: decryptAES(user.aadharNumber),
        address: {
            street: decryptAES(user.address.street),
            city: decryptAES(user.address.city),
            state: decryptAES(user.address.state),
            zip: decryptAES(user.address.zip),
            country: decryptAES(user.address.country)
        }

    }
}
