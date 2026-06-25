---
sidebar_position: 1
---

# AWS Organizations अकाउंट माइग्रेशन तत्परता गाइड

> **अस्वीकरण:** यह गाइड AWS Organizations के बीच AWS अकाउंट transfer करते समय सामान्य रूप से सामने आने वाली dependencies और विचारणीय बिंदुओं के आधार पर best-effort मार्गदर्शन प्रदान करती है। किसी भी माइग्रेशन की सफल पूर्णता प्रत्येक ग्राहक के अद्वितीय परिदृश्य, वर्कलोड और dependencies पर निर्भर करती है। ग्राहक अपने विशिष्ट एनवायरनमेंट का पूरी तरह से आकलन करने, सभी dependencies को validate करने और निष्पादन से पहले अपनी माइग्रेशन योजना का परीक्षण करने के लिए जिम्मेदार हैं। यह गाइड हर संभावित dependency या edge case को कवर नहीं करती।

## दायरा

यह गाइड **AWS Organizations के बीच अकाउंट माइग्रेशन** को कवर करती है। यहां वर्णित दृष्टिकोण समीक्षा और आकलन प्रक्रिया को तेज करने के लिए [Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) और [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md) का उपयोग करता है। आप जिन tools या दृष्टिकोण का उपयोग करने का निर्णय लेते हैं उसके आधार पर, steps भिन्न हो सकते हैं, लेकिन यह इसे करने का एक validated तरीका प्रदान करता है।

:::tip
अकाउंट को AWS Control Tower एनवायरनमेंट में ले जाते समय, इस गाइड का उपयोग pre-migration dependency check के रूप में करें, फिर अकाउंट target organization में transfer होने के बाद पूरक के रूप में [Enroll an existing AWS account](https://docs.aws.amazon.com/controltower/latest/userguide/enroll-account.html) गाइड का पालन करें।
:::

## प्रमुख सेवाएं और dependencies एक नज़र में

निम्नलिखित तालिका प्रमुख AWS सेवाओं और सुविधाओं का सारांश देती है जो organizations के बीच अकाउंट transfer होने पर प्रभावित हो सकती हैं:

| Category | Service/feature | Impact on transfer |
|----------|----------------|-------------------|
| **Access control** | IAM Identity Center | Permission set assignments removed; users lose access |
| **Authorization** | Service control policies (SCPs) | Stop applying immediately |
| **Authorization** | Resource control policies (RCPs) | Stop applying immediately |
| **Declarative** | Declarative policies (EC2) | Stop applying immediately |
| **Management** | Tag, Backup, AI opt-out policies | Detached from account |
| **Infrastructure** | AWS CloudFormation StackSets | Resources may be deleted (depends on retention setting) |
| **Resource sharing** | AWS Resource Access Manager | Organization-scoped shares revoked (unless retention enabled) |
| **Delegation** | Delegated administrator services | Must deregister before transfer; some services delete data |
| **Policy conditions** | `aws:PrincipalOrgID` / `aws:PrincipalOrgPaths` | Policies referencing source organization ID will deny access |
| **Billing** | Reserved Instances / Savings Plans | Organization-wide sharing benefits lost |
| **Billing** | Cost allocation tags | Must re-activate in target organization |
| **ऑब्ज़र्वेबिलिटी** | Amazon EventBridge cross-account | Event bus policies referencing organization ID will break |
| **Account access** | Root user / `OrganizationAccountAccessRole` | May lose all access if not verified before transfer |

## अवलोकन

यह गाइड AWS Organizations के बीच AWS अकाउंट transfer करने से पहले माइग्रेशन तत्परता का आकलन करने के लिए एक step-by-step प्रक्रिया प्रदान करती है। यह automated tooling ([Account Assessment for AWS Organizations](https://docs.aws.amazon.com/solutions/account-assessment-for-aws-organizations/) + [CFAT](https://github.com/cloud-foundations-on-aws/cloud-foundations-templates/blob/main/cfat/README.md)) को validated CLI commands के साथ जोड़कर सभी dependencies को कवर करती है।

**इसके लिए लागू:** Mergers & acquisitions, organization consolidation, account restructuring.

**उपयोग की गई प्रमुख सुविधाएं:**
- [Direct Account Transfers](https://aws.amazon.com/about-aws/whats-new/2025/11/aws-organizations-direct-account-transfers/) (Nov 2025) — कोई standalone अवधि आवश्यक नहीं
- [AWS RAM RetainSharingOnAccountLeaveOrganization](https://aws.amazon.com/about-aws/whats-new/2026/02/aws-resource-access-manager/) (Feb 2026) — transfer के दौरान resource shares संरक्षित

**संदर्भ:**
- [Migrate an account to another organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_account_migration.html) — AWS documentation
- [Moving an account - Part 1: Policies, AWS RAM, condition keys](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-1/) — AWS blog
- [Moving an account - Part 2: Delegated administrators](https://aws.amazon.com/blogs/mt/aws-organizations-moving-an-organization-member-account-to-another-organization-part-2/) — AWS blog

---

इस गाइड की शेष विस्तृत सामग्री (Phase 1-7, Appendix) के लिए कृपया [English source document](/docs/guides/organizations-and-accounts/account-migration-readiness/) देखें, क्योंकि इसमें मुख्य रूप से CLI commands और कॉन्फ़िगरेशन कोड है जो translation के बिना सीधे उपयोग किया जा सकता है।
