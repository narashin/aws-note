import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AWS from 'aws-sdk';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AwsService {
  constructor() {
    // AWS.config.update({accessKeyId:accessKey, secretAccessKey:secretAccessKey});
  }

  async getVpc(region) {
    let vpc;
    const ec2 = new AWS.EC2({ region });
    const data = await ec2.describeVpcs().promise();
    for (const Vpc of data.Vpcs) {
      for (const elm in Vpc) {
        switch (elm) {
          case 'VpcId':
            vpc.id = Vpc[elm];
            break;
          case 'Tags':
            vpc.name = getResourceName(Vpc[elm]);
            break;
          case 'CidrBlock':
            vpc.cidr = Vpc[elm];
            break;
        }
      }
      vpc.push({ id: vpc.id, name: vpc.name, cidr: vpc.cidr });
    }
    return vpc;
  }

  async getNetworkInfra(region, vpcid) {
    const ec2 = new AWS.EC2({ region });
    const params = {
      Filters: [
        {
          Name: 'vpc-id',
          Values: [vpcid],
        },
      ],
    };
    let temp;
    let network = { Subnets: [], ACLs: [], RouteTables: [], NatGateways: [] };
    const routetableData = await ec2.describeRouteTables(params).promise();
    const subnetData = await ec2.describeSubnets(params).promise();
    // const aclsData = await ec2.describeNetworkAcls(params).promise();
    const natgwData = await ec2
      .describeNatGateways({ Filter: [{ Name: 'vpc-id', Values: [vpcid] }] })
      .promise();

    for (const rt of routetableData.RouteTables) {
      for (const elm in rt) {
        switch (elm) {
          case 'Tags':
            temp.RouteTableName = getResourceName(rt[elm]);
            break;
          case 'RouteTableId':
            temp.RouteTableId = rt[elm];
            break;
        }
      }
      network.RouteTables.push({
        RouteTableName: temp.RouteTableName,
        RouteTableId: temp.RouteTableId,
      });
    }

    for (const subnet of subnetData.Subnets) {
      for (const elm in subnet) {
        switch (elm) {
          case 'Tags':
            temp.SubnetName = getResourceName(subnet[elm]);
            break;
          case 'CidrBlock':
            temp.SubnetCidr = subnet[elm];
            break;
          case 'SubnetId':
            temp.SubnetId = subnet[elm];
            break;
          case 'MapPublicIpOnLaunch':
            temp.MapPublicIpOnLaunch = subnet[elm];
            break;
          case 'AvailabilityZone':
            temp.SubnetAZ = subnet[elm];
            break;
        }
      }

      network.Subnets.push({
        SubnetName: temp.SubnetName,
        SubnetId: temp.SubnetId,
        SubnetCidr: temp.SubnetCidr,
        SubnetAZ: temp.SubnetAZ,
        MapPublicIpLaunch: temp.MapPublicIpOnLaunch,
      });
    }

    for (const natgw of natgwData.NatGateways) {
      for (const elm in natgw) {
        switch (elm) {
          case 'Tags':
            temp.NatgatewayName = getResourceName(natgw[elm]);
            break;
          case 'NatGatewayAddresses':
            temp.NatgatewayAddress = natgw[elm];
            break;
          case 'SubnetId':
            temp.NatgatewaySubnet = natgw[elm];
            break;
        }
      }
      network.NatGateways.push({
        NatgatewayName: temp.NatgatewayName,
        NatgatewayAddresses: temp.NatgatewayAddress,
        NatgatewaySubnet: temp.NatgatewaySubnet,
      });
    }
    return network;
  }

  async getEc2(region, vpcid) {
    const ec2 = new AWS.EC2({ region });
    let ec2instance;
    const data = await ec2
      .describeInstances({ Filters: [{ Name: 'vpc-id', Values: [vpcid] }] })
      .promise();

    for (const item of data.Reservations) {
      let instance = item.Instances;
      for (const elm of instance) {
        for (const i in elm) {
          switch (i) {
            case 'Tags':
              ec2instance.InstanceName = getResourceName(elm[i]);
              break;
            case 'SecurityGroups':
              ec2instance.SecurityGroups = elm[i];
              break;
            case 'InstanceId':
              ec2instance.InstanceId = elm[i];
              break;
            case 'SubnetId':
              ec2instance.SubnetId = elm[i];
              break;
            case 'InstanceType':
              ec2instance.InstanceType = elm[i];
              break;
            case 'KeyName':
              ec2instance.KeyName = elm[i];
              break;
            case 'PublicDnsName':
              ec2instance.PublicDnsName = elm[i];
              break;
            case 'PrivateIpAddress':
              ec2instance.PrivateIpAddress = elm[i];
              break;
            case 'Placement':
              ec2instance.AvailabilityZone = elm[i].AvailabilityZone;
              break;
            case 'BlockDeviceMappings':
              ec2instance.BlockDeviceMappings = elm[i];
              break;
          }
        }

        ec2instance.push({
          InstanceId: ec2instance.InstanceId,
          BlockDeviceMappings: ec2instance.BlockDeviceMappings,
          InstanceName: ec2instance.InstanceName,
          SecurityGroups: ec2instance.SecurityGroups,
          SubnetId: ec2instance.SubnetId,
          InstanceType: ec2instance.InstanceType,
          AvailabilityZone: ec2instance.AvailabilityZone,
          KeyName: ec2instance.KeyName,
          PublicDnsName: ec2instance.PublicDnsName,
          PrivateIpAddress: ec2instance.PrivateIpAddress,
        });
      }
    }
    return ec2instance;
  }

  async getSecurityGroup(region, vpcid) {
    const ec2 = new AWS.EC2({ region });
    let securitygroup;
    const data = await ec2
      .describeSecurityGroups({
        Filters: [{ Name: 'vpc-id', Values: [vpcid] }],
      })
      .promise();

    for (const sg of data.SecurityGroups) {
      for (const elm in sg) {
        switch (elm) {
          case 'GroupName':
            securitygroup.GroupName = sg[elm];
            break;
          case 'GroupId':
            securitygroup.GroupId = sg[elm];
            break;
          case 'IpPermissions':
            securitygroup.IpPermissions = sg[elm];
            break;
          case 'Description':
            securitygroup.Description = sg[elm];
            break;
        }
      }
      securitygroup.push({
        GroupName: securitygroup.GroupName,
        GroupId: securitygroup.GroupId,
        IpPermissions: securitygroup.IpPermissions,
        Description: securitygroup.Description,
      });
    }
    return securitygroup;
  }

  async getElb(region, vpcid) {
    const clb = new AWS.ELB({ region });
    const elbv2 = new AWS.ELBv2({ region });
    const autoscaling = new AWS.AutoScaling({ region });
    const data = await elbv2.describeLoadBalancers().promise();
    const clbData = await clb.describeLoadBalancers().promise();
    const targetgroupData = await elbv2.describeTargetGroups().promise();
    const asData = await autoscaling.describeAutoScalingGroups().promise();
    let elb;

    for (const clb of clbData.LoadBalancerDescriptions) {
      if (clb.VPCId === vpcid) {
        for (const elm in clb) {
          switch (elm) {
            case 'DNSName':
              elb.DNSName = clb[elm];
              break;
            case 'LoadBalancerName':
              elb.LoadBalancerName = clb[elm];
              break;
            case 'AvailabilityZones':
              elb.AvailabilityZones = clb[elm];
              break;
            case 'ListenerDescriptions':
              elb.ListenerDescriptions = clb[elm];
              break;
            case 'HealthCheck':
              elb.HealthCheck = clb[elm];
              break;
          }
        }
      }
      elb.push({
        DNSName: elb.DNSName,
        LoadBalancerName: elb.LoadBalancerName,
        AvailabilityZones: elb.AvailabilityZones,
        ListenerDescriptions: elb.ListenerDescriptions,
      });
    }

    for (const lb of data.LoadBalancers) {
      if (lb.VpcId === vpcid) {
        for (const elm in lb) {
          switch (elm) {
            case 'DNSName':
              elb.DNSName = lb[elm];
              break;
            case 'LoadBalancerName':
              elb.LoadBalancerName = lb[elm];
              break;
            case 'AvailabilityZones':
              elb.AvailabilityZones = lb[elm];
              break;
            case 'LoadBalancerArn':
              elb.LoadBalancerArn = lb[elm];
              for (const target of targetgroupData.TargetGroups) {
                if (
                  target.LoadBalancerArns.find(
                    (elm) => elm === elb.LoadBalancerArn,
                  ) !== undefined
                ) {
                  for (const item in target) {
                    switch (item) {
                      case 'TargetGroupName':
                        elb.TargetGroupName = target[item];
                        break;
                      case 'Port':
                        elb.Port = target[item];
                        break;
                      case 'HealthCheckProtocol':
                        elb.HealthCheckProtocol = target[item];
                        break;
                      case 'HealthCheckPath':
                        elb.HealthCheckPath = target[item];
                        break;
                      case 'TargetGroupArn':
                        elb.TargetGroupArn = target[item];
                        for (const as of asData.AutoScalingGroups) {
                          if (
                            as.TargetGroupARNs.find(
                              (elm) => elm === elb.TargetGroupArn,
                            ) !== undefined
                          ) {
                            for (const item in as) {
                              switch (item) {
                                case 'AutoScalingGroupName':
                                  elb.AutoScalingGroupName = as[item];
                                  break;
                                case 'LaunchConfigurationName':
                                  elb.LaunchConfigurationName = as[item];
                                  break;
                                case 'Instances':
                                  elb.Instances = as[item];
                                  break;
                                case 'MaxSize':
                                  elb.MaxSize = as[item];
                                  break;
                                case 'MinSize':
                                  elb.MinSize = as[item];
                                  break;
                                case 'DesiredCapacity':
                                  elb.DesiredCapacity = as[item];
                                  break;
                                case 'TerminationPolicies':
                                  elb.TerminationPolicies = as[item];
                                  break;
                                case 'AvailabilityZones':
                                  elb.AvailabilityZones2 = as[item];
                                  break;
                              }
                            }
                          }
                        }
                    }
                  }
                }
              }
          }
        }
      }
      elb.push({
        DNSName: elb.DNSName,
        LoadBalancerName: elb.LoadBalancerName,
        AvailabilityZones: elb.AvailabilityZones,
        LoadBalancerArn: elb.LoadBalancerArn,
        TargetGroupName: elb.TargetGroupName,
        TargetGroupArn: elb.TargetGroupArn,
        Port: elb.Port,
        HealthCheckProtocol: elb.HealthCheckProtocol,
        HealthCheckPath: elb.HealthCheckPath,
      });
    }
    return elb;
  }

  // async getAutoScaling(region, vpcid) {
  //   const ec2 = new AWS.EC2({ region });
  //   const autoscaling = new AWS.AutoScaling({ region });
  //   let asc;
  //   const subnetData = await ec2
  //     .describeSubnets({ Filters: [{ Name: 'vpc-id', Values: [vpcid] }] })
  //     .promise();
  //   let subnets = [];
  //   const asData = await autoscaling.describeAutoScalingGroups().promise();

  //   for (const subnet of subnetData.Subnets) {
  //     for (const elm in subnet) {
  //       if (elm === 'SubnetId') {
  //         subnets.push(subnet[elm]);
  //       }
  //     }
  //   }

  //   for (const as of asData.AutoScalingGroups) {
  //     for (const item in as) {
  //       if (
  //         subnets.find((elm) => elm === item.VPCZoneIdentifier) !== undefined
  //       ) {
  //         switch (item) {
  //           case 'AutoScalingGroupName':
  //             asc.AutoScalingGroupName = as[item];
  //             break;
  //           case 'LaunchConfigurationName':
  //             asc.LaunchConfigurationName = as[item];
  //             break;
  //           case 'Instances':
  //             asc.Instances = as[item];
  //             break;
  //           case 'MaxSize':
  //             asc.MaxSize = as[item];
  //             break;
  //           case 'MinSize':
  //             asc.MinSize = as[item];
  //             break;
  //           case 'DesiredCapacity':
  //             asc.DesiredCapacity = as[item];
  //             break;
  //           case 'TerminationPolicies':
  //             asc.TerminationPolicies = as[item];
  //             break;
  //           case 'AvailabilityZones':
  //             asc.AvailabilityZones = as[item];
  //             break;
  //         }
  //       }
  //     }
  //     asc.push({
  //       AutoScalingGroupName: asc.AutoScalingGroupName,
  //       LaunchConfigurationName: asc.LaunchConfigurationName,
  //       Instances: asc.Instances,
  //       MaxSize: asc.MaxSize,
  //       MinSize: asc.MinSize,
  //       DesiredCapacity: asc.DesiredCapacity,
  //       TerminationPolicies: asc.TerminationPolicies,
  //       AvailabilityZones: asc.AvailabilityZones,
  //     });
  //   }
  //   return asc;
  // }

  // async getRds(region, vpcid) {
  //   const rds = new AWS.RDS({ region });
  //   const data = await rds.describeDBInstances().promise();
  //   let rdsdb;

  //   for (const db of data.DBInstances) {
  //     if (db.DBSubnetGroup.VpcId === vpcid)
  //       for (const elm in db) {
  //         switch (elm) {
  //           case 'DBInstanceIdentifier':
  //             rdsdb.DBInstanceIdentifier = db[elm];
  //             break;
  //           case 'Engine':
  //             rdsdb.Engine = db[elm];
  //             break;
  //           case 'DBInstanceClass':
  //             rdsdb.DBInstanceClass = db[elm];
  //             break;
  //           case 'MultiAZ':
  //             rdsdb.MultiAZ = db[elm];
  //             break;
  //           case 'PubliclyAccessible':
  //             rdsdb.PubliclyAccessible = db[elm];
  //             break;
  //           case 'Endpoint':
  //             rdsdb.Endpoint = db[elm.Address];
  //             break;
  //         }
  //       }
  //     rdsdb.push({
  //       DBInstanceIdentifier: rdsdb.DBInstanceIdentifier,
  //       Engine: rdsdb.Engine,
  //       DBInstanceClass: rdsdb.DBInstanceClass,
  //       MultiAZ: rdsdb.MultiAZ,
  //       PubliclyAccessible: rdsdb.PubliclyAccessible,
  //       Endpoint: rdsdb.Endpoint,
  //     });
  //   }
  //   return rdsdb;
  // }

  // async getRdsNoVpc(region) {
  //   const rds = new AWS.RDS({ region });
  //   const data = await rds.describeDBInstances().promise();
  //   let rdsdb;

  //   for (const db of data.DBInstances) {
  //     for (const elm in db) {
  //       switch (elm) {
  //         case 'DBInstanceIdentifier':
  //           rdsdb.DBInstanceIdentifier = db[elm];
  //           break;
  //         case 'Engine':
  //           rdsdb.Engine = db[elm];
  //           break;
  //         case 'DBInstanceClass':
  //           rdsdb.DBInstanceClass = db[elm];
  //           break;
  //         case 'MultiAZ':
  //           rdsdb.MultiAZ = db[elm];
  //           break;
  //         case 'PubliclyAccessible':
  //           rdsdb.PubliclyAccessible = db[elm];
  //           break;
  //         case 'Endpoint':
  //           rdsdb.Endpoint = db[elm.Address];
  //           break;
  //       }
  //     }
  //     rdsdb.push({
  //       DBInstanceIdentifier: rdsdb.DBInstanceIdentifier,
  //       Engine: rdsdb.Engine,
  //       DBInstanceClass: rdsdb.DBInstanceClass,
  //       MultiAZ: rdsdb.MultiAZ,
  //       PubliclyAccessible: rdsdb.PubliclyAccessible,
  //       Endpoint: rdsdb.Endpoint,
  //     });
  //   }
  //   return rdsdb;
  // }

  // async getElasticache(region, vpcid) {
  //   const elasticache = new AWS.ElastiCache({ region });
  //   const data = await elasticache.describeCacheClusters().promise();
  //   let ec;

  //   for (const item of data.CacheClusters) {
  //     if (
  //       item.CacheSubnetGroups.find((elm) => elm.VpcId === vpcid) !== undefined
  //     ) {
  //       for (const elm in item) {
  //         switch (elm) {
  //           case 'ReplicationGroupId':
  //             ec.ReplicationGroupId = item[elm];
  //             break;
  //           case 'CacheClusterId':
  //             ec.CacheClusterId = item[elm];
  //             break;
  //           case 'Engine':
  //             ec.Engine = item[elm];
  //             break;
  //           case 'EngineVersion':
  //             ec.EngineVersion = item[elm];
  //             break;
  //           case 'CacheNodeType':
  //             ec.CacheNodeType = item[elm];
  //             break;
  //           case 'CacheSubnetGroupName':
  //             ec.CacheSubnetGroupName = item[elm];
  //             break;
  //           case 'ConfigurationEndpoint':
  //             ec.ConfigurationEndpoint = item[elm.Address];
  //             break;
  //           case 'ReplNodeGroups':
  //             ec.ReplNodeGroups = item[elm];
  //             break;
  //         }
  //       }
  //       ec.push({
  //         ReplicationGroupId: ec.ReplicationGroupId,
  //         CacheClusterId: ec.CacheClusterId,
  //         Engine: ec.Engine,
  //         EngineVersion: ec.EngineVersion,
  //         CacheNodeType: ec.CacheNodeType,
  //         CacheSubnetGroupName: ec.CacheSubnetGroupName,
  //         ConfigurationEndpoint: ec.ConfigurationEndpoint,
  //         ReplNodeGroups: ec.ReplNodeGroups,
  //       });
  //     }
  //   }
  //   return ec;
  // }

  // async getElasticacheNoVpc(region) {
  //   const elasticache = new AWS.ElastiCache({ region });
  //   const data = await elasticache.describeCacheClusters().promise();
  //   let ec;

  //   for (const item of data.CacheClusters) {
  //     for (const elm in item) {
  //       switch (elm) {
  //         case 'ReplicationGroupId':
  //           ec.ReplicationGroupId = item[elm];
  //           break;
  //         case 'CacheClusterId':
  //           ec.CacheClusterId = item[elm];
  //           break;
  //         case 'Engine':
  //           ec.Engine = item[elm];
  //           break;
  //         case 'EngineVersion':
  //           ec.EngineVersion = item[elm];
  //           break;
  //         case 'CacheNodeType':
  //           ec.CacheNodeType = item[elm];
  //           break;
  //         case 'CacheSubnetGroupName':
  //           ec.CacheSubnetGroupName = item[elm];
  //           break;
  //         case 'ConfigurationEndpoint':
  //           ec.ConfigurationEndpoint = item[elm.Address];
  //           break;
  //         case 'ReplNodeGroups':
  //           ec.ReplNodeGroups = item[elm];
  //           break;
  //       }
  //       ec.push({
  //         ReplicationGroupId: ec.ReplicationGroupId,
  //         CacheClusterId: ec.CacheClusterId,
  //         Engine: ec.Engine,
  //         EngineVersion: ec.EngineVersion,
  //         CacheNodeType: ec.CacheNodeType,
  //         CacheSubnetGroupName: ec.CacheSubnetGroupName,
  //         ConfigurationEndpoint: ec.ConfigurationEndpoint,
  //         ReplNodeGroups: ec.ReplNodeGroups,
  //       });
  //     }
  //   }
  //   return ec;
  // }

  // async getRedshift(region, vpcid) {
  //   const redshift = new AWS.Redshift({ region });
  //   const data = await redshift.describeClusters().promise();
  //   let redshifts;

  //   for (const item of data.Clusters) {
  //     if (item.VpcId === vpcid) {
  //       for (const elm in cluster) {
  //         switch (elm) {
  //           case 'ClusterIdentifier':
  //             redshifts.ClusterIdentifier = item[elm];
  //             break;
  //           case 'NodeType':
  //             redshift.NodeType = item[elm];
  //             break;
  //           case 'ClusterNodes':
  //             redshift.ClusterNodes = item[elm];
  //             break;
  //           case 'AvailabilityZone':
  //             redshift.AvailabilityZone = item[elm];
  //             break;
  //           case 'ClusterSubnetGroupName':
  //             redshift.ClusterSubnetGroupName = item[elm];
  //             break;
  //           case 'VpcSecurityGroups':
  //             redshift.VpcSecurityGroups = item[elm];
  //             break;
  //           case 'ClusterParameterGroups':
  //             redshift.ClusterParameterGroups = item[elm];
  //             break;
  //           case 'PubliclyAccessible':
  //             redshift.PubliclyAccessible = item[elm];
  //             break;
  //           case 'DBName':
  //             redshift.DBName = item[elm];
  //             break;
  //           case 'MasterUsername':
  //             redshifts.MasterUsername = item[elm];
  //             break;
  //           case 'Endpoint':
  //             redshifts.Endpoint = item[elm];
  //             break;
  //         }
  //       }
  //       redshifts.push({
  //         ClusterIdentifier: redshifts.ClusterIdentifier,
  //         NodeType: redshift.NodeType,
  //         ClusterNodes: redshift.ClusterNodes,
  //         AvailabilityZone: redshift.AvailabilityZone,
  //         ClusterSubnetGroupName: redshift.ClusterSubnetGroupName,
  //         VpcSecurityGroups: redshift.VpcSecurityGroups,
  //         ClusterParameterGroups: redshift.ClusterParameterGroups,
  //         PubliclyAccessible: redshift.PubliclyAccessible,
  //         DBName: redshift.DBName,
  //         MasterUsername: redshifts.MasterUsername,
  //         Endpoint: redshifts.Endpoint,
  //       });
  //     }
  //   }
  //   return redshifts;
  // }

  // async getRedshiftNoVpc(region) {
  //   const redshift = new AWS.Redshift({ region });
  //   const data = await redshift.describeClusters().promise();
  //   let redshifts;

  //   for (const item of data.Clusters) {
  //     for (const elm in cluster) {
  //       switch (elm) {
  //         case 'ClusterIdentifier':
  //           redshifts.ClusterIdentifier = item[elm];
  //           break;
  //         case 'NodeType':
  //           redshift.NodeType = item[elm];
  //           break;
  //         case 'ClusterNodes':
  //           redshift.ClusterNodes = item[elm];
  //           break;
  //         case 'AvailabilityZone':
  //           redshift.AvailabilityZone = item[elm];
  //           break;
  //         case 'ClusterSubnetGroupName':
  //           redshift.ClusterSubnetGroupName = item[elm];
  //           break;
  //         case 'VpcSecurityGroups':
  //           redshift.VpcSecurityGroups = item[elm];
  //           break;
  //         case 'ClusterParameterGroups':
  //           redshift.ClusterParameterGroups = item[elm];
  //           break;
  //         case 'PubliclyAccessible':
  //           redshift.PubliclyAccessible = item[elm];
  //           break;
  //         case 'DBName':
  //           redshift.DBName = item[elm];
  //           break;
  //         case 'MasterUsername':
  //           redshifts.MasterUsername = item[elm];
  //           break;
  //         case 'Endpoint':
  //           redshifts.Endpoint = itemp[elm];
  //           break;
  //       }
  //       redshifts.push({
  //         ClusterIdentifier: redshifts.ClusterIdentifier,
  //         NodeType: redshift.NodeType,
  //         ClusterNodes: redshift.ClusterNodes,
  //         AvailabilityZone: redshift.AvailabilityZone,
  //         ClusterSubnetGroupName: redshift.ClusterSubnetGroupName,
  //         VpcSecurityGroups: redshift.VpcSecurityGroups,
  //         ClusterParameterGroups: redshift.ClusterParameterGroups,
  //         PubliclyAccessible: redshift.PubliclyAccessible,
  //         DBName: redshift.DBName,
  //         MasterUsername: redshifts.MasterUsername,
  //         Endpoint: redshifts.Endpoint,
  //       });
  //     }
  //   }
  //   return redshifts;
  // }

  async getRoute53(region) {
    const route53 = new AWS.Route53({ region });
    const data = await route53.listHostedZones().promise();
    let hostedzone;

    for (const hz of data.HostedZones) {
      for (const elm in hz) {
        switch (elm) {
          case 'Id':
            hostedzone.Id = hz[elm];
            break;
          case 'Name':
            hostedzone.Name = hz[elm];
            break;
          case 'Config':
            hostedzone.Config = hz[elm];
            break;
          case 'ResourceRecordSetCount':
            hostedzone.ResourceRecordSetCount = hz[elm];
            break;
        }
      }
      hostedzone.push({
        Id: hostedzone.Id,
        Name: hostedzone.Name,
        Config: hostedzone.Config,
        ResourceRecordSetCount: hostedzone.ResourceRecordSetCount,
      });
    }
    return hostedzone;
  }

  async getCloudfront(region) {
    const cloudfront = new AWS.CloudFront({ region });
    const data = await cloudfront.listDistributions().promise();
    let cf;

    for (const item of data.DistributionList.Items) {
      for (const elm in item) {
        switch (elm) {
          case 'Id':
            cf.Id = item[elm];
            break;
          case 'DomainName':
            cf.DomainName = item[elm];
            break;
          case 'Origins':
            cf.Origins = item[elm];
            break;
        }
      }
      cf.push({
        Id: cf.Id,
        DomainName: cf.DomainName,
        Origins: cf.Origins,
      });
    }
    return cf;
  }

  async getS3(region) {
    const s3 = new AWS.S3({ region });
    const data = await s3.listBuckets().promise();
    let buckets;

    for (const bucket of data.Buckets) {
      for (const elm in bucket) {
        switch (elm) {
          case 'Name':
            buckets.Name = bucket[elm];
            buckets.Region = await s3
              .getBucketLocation({ Bucket: bucket[elm] })
              .promise();
            // buckets.ACL= await s3.getBucketAcl({Bucket:bucket[elm]}).promise();
            break;
          case 'CreationDate':
            buckets.CreationDate = bucket[elm];
        }
      }
      buckets.push({
        Name: buckets.Name,
        Region: buckets.Region,
        ACL: buckets.ACL,
        CreationDate: buckets.CreationDate,
      });
    }
    return buckets;
  }
}

function getResourceName(obj) {
  return obj
    .filter((item) => {
      return item.Key === 'Name';
    })
    .map((item) => {
      return item.Value;
    })[0];
}
