
export const rolePermissions: Record<string, string[]> = {
  role_hrm_HR: [
    'only_HR',
    'read_applicant',
    'create_applicant',
    'detail_applicant',
    'update_applicant',
    'Pending_CV_Scanning',
    'Pending_Interview_Scheduling',
    'Pending_Offer',
    'Pending_Acceptance',
    'Onboarding',
    'Withdraw_Button',
    'Pending Rejection Approval',
    'Withdraw_Pending_Interview',
    'Withdraw_Pending_Interview'
  ],
  role_hrm_IB: [
    'read_applicant',
    'detail_applicant',
    'Pending_Interview_Board',
    'Pending_Interview',
    'Pending_Interview_Results',
    'addRemark',
    'Pending_Interview_Results_Onhold'
    
  ],
  role_CEO: [
    'read_applicant',
    'detail_applicant',
    'Pending_Offer_Approval'
    ],
  role_hrm_Interviewer: [
    'read_applicant',
    'detail_applicant',
     'Pending_Interview',
     'Pending_Interview_Results',
     'addRemark'
    ]
};