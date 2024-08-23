import axios from "axios";


const schemaRegistryUrl = 'https://psrc-95km5.eu-central-1.aws.confluent.cloud';
const username = '6SYG6T2IPDQX5UMI';
const password = 'ZKLL5Uqd7vU3sN+cVJ8ZlXF6YoQrqNtrDwTzSrp5zOZPodb2vsTEyrFgKZdFQam7';

const subject = 'com.obi.salesrep.inquiry.sanitized.v1';
const principal = 'User:i.akupuome@reply.de';
const operation = 'WRITE';

async function addAcl() {
  try {
    const response = await axios.post(`${schemaRegistryUrl}/api/v1/acl`, {
      resourceType: 'Subject',
      resourceName: subject,
      principal: principal,
      operation: operation,
      host: '*',
      permissionType: 'ALLOW'
    }, {
      auth: {
        username: username,
        password: password
      }
    });

    console.log('ACL added:', response.data);
  } catch (error) {
    console.error('Error adding ACL:', error.response ? error.response.data : error.message);
  }
}

addAcl();
