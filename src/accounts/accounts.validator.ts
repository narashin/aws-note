// import {
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';
// import * as AWS from 'aws-sdk';

// @ValidatorConstraint()
// export class CustomAccountsValidator implements ValidatorConstraintInterface {
//   validtate() {
//     new AWS.Credentials(accessKey, secretKey);
//     const params = {
//       AllRegions: true,
//     };

//     AWS.EC2.describeRegions((params) => {
//       if(err) console.log(err);

//     })
//   }
// }
