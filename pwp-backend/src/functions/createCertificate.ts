import forge from 'node-forge';
import fs from 'fs';
import path from 'path';

const createCertificate = (): string => {
  const pki = forge.pki;
  const keys = pki.rsa.generateKeyPair(2048);
  const pkey = fs.readFileSync(path.join(__dirname, '../', 'mqtt', 'certificates', 'root.key'));
  const privateKey = forge.pki.privateKeyFromPem(pkey);

  // create a new certificate
  const cert = pki.createCertificate();

  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  // use your own attributes here, or supply a csr (check the docs)
  const attrs = [
    {
      name: 'commonName',
      value: 'example.org',
    },
    {
      name: 'countryName',
      value: 'US',
    },
    {
      shortName: 'ST',
      value: 'Virginia',
    },
    {
      name: 'localityName',
      value: 'Blacksburg',
    },
    {
      name: 'organizationName',
      value: 'Test',
    },
    {
      shortName: 'OU',
      value: 'Test',
    },
  ];

  // here we set subject and issuer as the same one
  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  cert.sign(privateKey);

  // now convert the Forge certificate to PEM format
  const pem = pki.certificateToPem(cert);
  return pem;
};
export default createCertificate;
