import { Controller, Get, Param } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get(':region/vpc')
  async getVPC(@Param('region') region: string) {
    return this.awsService.getVpc(region);
  }

  @Get(':region/vpc/:vpcid/networking')
  getNetworkInfra(
    @Param('region') region: string,
    @Param('vpcid') vpcid: string,
  ) {
    return this.awsService.getNetworkInfra(region, vpcid);
  }

  @Get(':region/vpc/:vpcid/ec2')
  getEc2(@Param('region') region: string, @Param('vpcid') vpcid: string) {
    return this.awsService.getEc2(region, vpcid);
  }

  @Get(':region/vpc/:vpcid/sg')
  getSecurityGroup(
    @Param('region') region: string,
    @Param('vpcid') vpcid: string,
  ) {
    return this.awsService.getSecurityGroup(region, vpcid);
  }

  @Get(':region/vpc/:vpcid/elb')
  getElb(@Param('region') region: string, @Param('vpcid') vpcid: string) {
    return this.awsService.getElb(region, vpcid);
  }

  // @Get(':region/vpc/:vpcid/autoscaling')
  // getAutoScaling(
  //   @Param('region') region: string,
  //   @Param('vpcid') vpcid: string,
  // ) {
  //   return this.awsService.getAutoScaling(region, vpcid);
  // }

  // @Get(':region/vpc/:vpcid/rds')
  // getRds(@Param('region') region: string, @Param('vpcid') vpcid: string) {
  //   return this.awsService.getRds(region, vpcid);
  // }

  // @Get(':region/rds')
  // getRdsNoVpc(@Param('region') region: string) {
  //   return this.awsService.getRdsNoVpc(region);
  // }

  // @Get(':region/vpc/:vpcid/elasticache')
  // getElasticache(
  //   @Param('region') region: string,
  //   @Param('vpcid') vpcid: string,
  // ) {
  //   return this.awsService.getElasticache(region, vpcid);
  // }

  // @Get(':region/elasticache')
  // getElasticacheNoVpc(@Param('region') region: string) {
  //   return this.awsService.getElasticacheNoVpc(region);
  // }

  // @Get(':region/vpc/:vpcid/redshift')
  // getRedshift(@Param('region') region: string, @Param('vpcid') vpcid: string) {
  //   return this.awsService.getRedshift(region, vpcid);
  // }

  // @Get(':region/redshift')
  // getRedshiftNoVpc(@Param('region') region: string) {
  //   return this.awsService.getRedshiftNoVpc(region);
  // }

  @Get(':region/route53')
  getRoute53(@Param('region') region: string) {
    return this.awsService.getRoute53(region);
  }

  @Get(':region/cloudfront')
  getCloudfront(@Param('region') region: string) {
    return this.awsService.getCloudfront(region);
  }

  @Get(':region/s3')
  getS3(@Param('region') region: string) {
    return this.awsService.getS3(region);
  }
}
