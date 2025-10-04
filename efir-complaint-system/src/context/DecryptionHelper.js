import { decryptAES, encryptAES } from "../utils/AESEncryption.js";

export function decryptAddress(address = {}) {
    return {
        ...address,
        street: address.street ? decryptAES(address.street) : null,
        city: address.city ? decryptAES(address.city) : null,
        state: address.state ? decryptAES(address.state) : null,
        zip: address.zip ? decryptAES(address.zip) : null,
        country: address.country ? decryptAES(address.country) : null,
    };
}

export function decryptPerson(person = {}) {
    return {
        ...person,
        firstName: person.firstName ? decryptAES(person.firstName) : null,
        lastName: person.lastName ? decryptAES(person.lastName) : null,
        phone: person.phone ? decryptAES(person.phone) : null,
        address: person.address ? decryptAddress(person.address) : null,
    };
}

export function decryptIncident(incident = {}) {
    return {
        ...incident,
        description: incident.description ? decryptAES(incident.description) : null,
        address: incident.address ? decryptAddress(incident.address) : null,
        crimetype: incident.crimetype ? decryptAES(incident.crimetype) : null,
    };
}

export function decryptComplaint(complaint = {}) {
    return {
        ...complaint,
        victim: complaint.victim ? decryptPerson(complaint.victim) : null,
        accused: complaint.accused ? decryptPerson(complaint.accused) : null,
        incidence: complaint.incidence ? decryptIncident(complaint.incidence) : null,
        evidenceLink: complaint.evidenceLink ?? null,
    };
}

export function encryptAddress(address = {}) {
    return {
        ...address,
        street: address.street ? encryptAES(address.street) : null,
        city: address.city ? encryptAES(address.city) : null,
        state: address.state ? encryptAES(address.state) : null,
        zip: address.zip ? encryptAES(address.zip) : null,
        country: address.country ? encryptAES(address.country) : null,
    };
}

export function encryptPerson(person = {}) {
    return {
        ...person,
        firstName: person.firstName ? encryptAES(person.firstName) : null,
        lastName: person.lastName ? encryptAES(person.lastName) : null,
        phone: person.phone ? encryptAES(person.phone) : null,
        address: person.address ? encryptAddress(person.address) : null,
    };
}

export function encryptIncident(incident = {}) {
    return {
        ...incident,
        description: incident.description ? encryptAES(incident.description) : null,
        address: incident.address ? encryptAddress(incident.address) : null,
    };
}

export function encryptComplaint(complaint = {}) {
    return {
        ...complaint,
        victim: complaint.victim ? encryptPerson(complaint.victim) : null,
        accused: complaint.accused ? encryptPerson(complaint.accused) : null,
        incidence: complaint.incidence ? encryptIncident(complaint.incidence) : null,
        evidenceLink: complaint.evidenceLink ?? null,
    };
}

export function decryptuser(user = {}) {
    return {
        ...user,
        firstName: user.firstName ? decryptAES(user.firstName) : null,
        lastName: user.lastName ? decryptAES(user.lastName) : null,
        aadharNumber: user.aadharNumber ? decryptAES(user.aadharNumber) : null,
        address: user.address
            ? {
                street: user.address.street ? decryptAES(user.address.street) : null,
                city: user.address.city ? decryptAES(user.address.city) : null,
                state: user.address.state ? decryptAES(user.address.state) : null,
                zip: user.address.zip ? decryptAES(user.address.zip) : null,
                country: user.address.country ? decryptAES(user.address.country) : null,
            }
            : null,
    };
}
