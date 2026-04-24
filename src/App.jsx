import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './supabaseClient';
import * as XLSX from 'xlsx';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  ShieldAlert, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Building,
  Settings,
  Link as LinkIcon,
  MessageSquare,
  Edit3,
  Filter,
  Trash2,
  Plus,
  Lock,
  User,
  LogOut,
  Mail
} from 'lucide-react';

// --- Base Data Extraction ---
const rawInitialData = [
  {
    id: "d1",
    title: "Domain 1: Governance, Quality Assurance & Institutional Effectiveness",
    subdomains: [
      {
        id: "a1.1",
        title: "Sub-Domain 1.1: Quality Assurance & Accreditation Readiness Review",
        target: "Vice Chancellor – Quality Assurance and Institutional Effectiveness",
        risk: "High",
        criteria: [
          { id: "c1.1.1", text: "Review CAA and international accreditation compliance gap analysis reports and verify completion status of corrective action plans." },
          { id: "c1.1.2", text: "Sample the Program Review process: Verify that curriculum updates actively map to industry requirements, alumni feedback, and employer advisory boards." },
          { id: "c1.1.3", text: "Audit the Policy Lifecycle: Check for recent reviews, formal approvals, proper version control, and dissemination of policies via the Policies Specialist." },
          { id: "c1.1.4", text: "Validate Institutional Research data integrity: Trace reported institutional metrics back to raw source systems to ensure zero manipulation." },
          { id: "c1.1.5", text: "Review the integration of the Strategic Planning Committee’s multi-year goals with departmental annual KPIs and budget allocations." },
          { id: "c1.1.6", text: "Assess the 'Closing the Loop' process: Verify that student end-of-course evaluations directly inform tangible changes in syllabi or teaching methods." },
          { id: "c1.1.7", text: "Evaluate Peer Review of Teaching logs to ensure continuous pedagogical improvement is enforced across all academic departments." },
          { id: "c1.1.8", text: "Review the execution and outcomes of internal 'Mock Accreditation' visits." }
        ]
      },
      {
        id: "a1.2",
        title: "Sub-Domain 1.2: Enterprise Governance & Committee Effectiveness",
        target: "Board of Trustees, Chancellor's Office, University Council, Legal Advisor",
        risk: "Medium",
        criteria: [
          { id: "c1.2.1", text: "Review meeting minutes, agendas, and quorum records for the University Council, Deans Council, and Board of Trustees for the past 12 months." },
          { id: "c1.2.2", text: "Verify the existence, annual updating, and secure storage of Conflict of Interest (COI) and Non-Disclosure declarations for all board and council members." },
          { id: "c1.2.3", text: "Assess the Delegation of Authority (DOA) matrix: Verify that actual financial, operational, and academic authorizations map correctly to the documented DOA." },
          { id: "c1.2.4", text: "Review external legal counsel engagement logs, contract review turnaround times, and pending litigation/risk reports filed by the Legal Advisor." },
          { id: "c1.2.5", text: "Audit the tracking mechanism for Board and Council resolutions to ensure mandated actions are executed within the specified timeframes." },
          { id: "c1.2.6", text: "Verify the implementation of a formal onboarding and training process for newly appointed Board of Trustees members." }
        ]
      },
      {
        id: "a1.3",
        title: "Sub-Domain 1.3: Enterprise Risk Management (ERM) & Compliance Framework",
        target: "Audit, Risk & Compliance Committee, Compliance Office",
        risk: "High",
        criteria: [
          { id: "c1.3.1", text: "Review the University Risk Register for completeness, updated risk scorings, assigned risk owners, and realistic mitigation timelines." },
          { id: "c1.3.2", text: "Audit the monitoring process for external regulatory changes (e.g., changes in DHA licensing requirements)." },
          { id: "c1.3.3", text: "Verify the operational effectiveness of the university's anonymous whistleblower hotline, including anonymity protections." },
          { id: "c1.3.4", text: "Assess the integration of the ERM framework with the university's Business Continuity Planning (BCP) and crisis management strategies." },
          { id: "c1.3.5", text: "Test a sample of 'High Risk' mitigation controls defined in the Risk Register to ensure they are functioning effectively in practice." }
        ]
      }
    ]
  },
  {
    id: "d2",
    title: "Domain 2: Academic Affairs & Student Lifecycle",
    subdomains: [
      {
        id: "a2.1",
        title: "Sub-Domain 2.1: College Operations & Clinical Affairs Management",
        target: "Deans of Medicine, Pharmacy, Nursing; Associate Deans of Clinical Affairs",
        risk: "High",
        criteria: [
          { id: "c2.1.1", text: "Sample faculty workload distribution: Ensure strict compliance with UAE higher education teaching credit limits vs. protected research/clinical time." },
          { id: "c2.1.2", text: "Review clinical rotation scheduling: Verify active, legally vetted affiliation agreements with partner hospitals/clinics." },
          { id: "c2.1.3", text: "Audit student clinical attendance logs and preceptor evaluation forms for authenticity and timely submission." },
          { id: "c2.1.4", text: "Evaluate the operational standards of Objective Structured Clinical Examinations (OSCEs), including standardized patient training and grading moderation." },
          { id: "c2.1.5", text: "Verify that faculty maintain documented, reliable 'Office Hours' for student consultation." },
          { id: "c2.1.6", text: "Assess the operations of the Head of Medical Education Department regarding faculty development programs." },
          { id: "c2.1.7", text: "Review the processes used by Assistant Deans of Quality to standardize assessments and syllabi across multi-section courses." }
        ]
      },
      {
        id: "a2.2",
        title: "Sub-Domain 2.2: Admissions, Registration & Scholarship Integrity",
        target: "Director of Admissions & Registration, Registrar, Scholarship Committee",
        risk: "Critical",
        criteria: [
          { id: "c2.2.1", text: "Sample admitted student files: Verify EmSAT scores, high school equivalencies, and prerequisite science grades meet exact CAA requirements." },
          { id: "c2.2.2", text: "Audit 'Conditional Admissions': Ensure students meet conditions within the mandated timeframe or are dismissed." },
          { id: "c2.2.3", text: "Review transfer credit evaluations for compliance with university policy." },
          { id: "c2.2.4", text: "Audit the Scholarship Committee: Re-calculate a sample of 30 scholarship awards to ensure they match published criteria." },
          { id: "c2.2.5", text: "Verify the enforcement of scholarship renewal criteria and audit the revocation process for underperforming scholars." },
          { id: "c2.2.6", text: "Audit recruitment agency contracts and sample commission payouts to ensure alignment with enrolled student retention data." },
          { id: "c2.2.7", text: "Inspect physical and digital security controls surrounding the issuance of official transcripts and certificates." }
        ]
      },
      {
        id: "a2.3",
        title: "Sub-Domain 2.3: Student Well-being, Success & Engagement",
        target: "Dean – Student Affairs, Student Wellbeing Specialist, Career Services",
        risk: "Medium",
        criteria: [
          { id: "c2.3.1", text: "Review confidentiality protocols, secure record-keeping, and emergency escalation procedures for counseling sessions." },
          { id: "c2.3.2", text: "Evaluate counseling wait times and the ratio of mental health professionals to the student population." },
          { id: "c2.3.3", text: "Audit Student Success Centers: Review metrics on early-warning student interventions and academic probation tracking." },
          { id: "c2.3.4", text: "Audit Student Club finances: Review annual budgets, individual expense approvals, and post-event financial reconciliations." },
          { id: "c2.3.5", text: "Review the centralized tracking, handling, and resolution timelines of formalized student grievances and academic appeals." },
          { id: "c2.3.6", text: "Assess the effectiveness of Career Services by verifying graduate employability tracking methodologies." },
          { id: "c2.3.7", text: "Evaluate campus accessibility and accommodation provisions for students with documented disabilities." }
        ]
      }
    ]
  },
  {
    id: "d3",
    title: "Domain 3: Academic Support & Technological Infrastructure",
    subdomains: [
      {
        id: "a3.1",
        title: "Sub-Domain 3.1: Academic Support Technologies & SIS Integrity",
        target: "Head of Academic Support Department, Head of AI & Smart Education",
        risk: "Critical",
        criteria: [
          { id: "c3.1.1", text: "Review formal User Access Reviews (UAR) for the SIS: Ensure RBAC is strictly enforced." },
          { id: "c3.1.2", text: "Audit system audit trails: Extract a report of manual grade changes and trace 100% of high-risk changes back to approved forms." },
          { id: "c3.1.3", text: "Test API integrations between the SIS, the LMS, and the Finance module to ensure data synchronization accuracy." },
          { id: "c3.1.4", text: "Evaluate Examination Unit protocols: Review exam paper drafting security, physical printing/vault controls, and chain-of-custody." },
          { id: "c3.1.5", text: "Assess digital examination security: Review configurations of lockdown browsers and digital proctoring software." },
          { id: "c3.1.6", text: "Assess AI & Smart Education governance: Review institutional policies on student use of Generative AI and plagiarism detection software." },
          { id: "c3.1.7", text: "Audit Academic Integrity violation logs to identify trends in AI-assisted plagiarism." }
        ]
      },
      {
        id: "a3.2",
        title: "Sub-Domain 3.2: Clinical Simulation Center & Learning Resources",
        target: "Head of Simulation Center, Head of Learning Resource Center",
        risk: "Medium",
        criteria: [
          { id: "c3.2.1", text: "Review preventative maintenance schedules and calibration logs for high-fidelity medical simulation mannequins." },
          { id: "c3.2.2", text: "Assess inventory management for consumable medical supplies in the simulation center to prevent stock-outs." },
          { id: "c3.2.3", text: "Evaluate simulation debriefing protocols: Ensure faculty are conducting mandated post-simulation debriefings and securely storing videos." },
          { id: "c3.2.4", text: "Audit the Learning Resource Center: Review digital journal subscription utilization rates versus cost." },
          { id: "c3.2.5", text: "Assess the process for acquiring new medical textbooks and databases based on faculty requests." },
          { id: "c3.2.6", text: "Verify copyright compliance mechanisms for materials uploaded to the university's LMS by faculty." }
        ]
      }
    ]
  },
  {
    id: "d4",
    title: "Domain 4: Shared Services (Financial, HR, IT, Operations)",
    subdomains: [
      {
        id: "a4.1",
        title: "Sub-Domain 4.1: Financial Management, Procurement & Revenue Cycle",
        target: "Shared Services (Finance Manager, Operations Manager)",
        risk: "High",
        criteria: [
          { id: "c4.1.1", text: "Test the 'Three-Way Match': Sample 50 high-value payments to ensure POs, Receiving Reports, and Invoices align." },
          { id: "c4.1.2", text: "Review Vendor Onboarding: Check for competitive bidding documentation and vendor conflict-of-interest screening." },
          { id: "c4.1.3", text: "Audit Capital Expenditure (CapEx): Verify major purchases are tracked against budgets and asset-tagged." },
          { id: "c4.1.4", text: "Analyze tuition fee collection: Review aging accounts receivable, late fees, and uncollectible debt write-off approvals." },
          { id: "c4.1.5", text: "Audit Petty Cash handling: Conduct surprise cash counts and review replenishment vouchers." },
          { id: "c4.1.6", text: "Review employee travel and expense reimbursement claims for adherence to policy." },
          { id: "c4.1.7", text: "Audit monthly/quarterly Budget vs. Actual reporting submitted to the University Council." }
        ]
      },
      {
        id: "a4.2",
        title: "Sub-Domain 4.2: Information Technology Security & Data Privacy",
        target: "Shared Services (IT Department)",
        risk: "Critical",
        criteria: [
          { id: "c4.2.1", text: "Review results and remediation plans of the latest internal/external network penetration tests." },
          { id: "c4.2.2", text: "Audit IT user lifecycle management: Sample terminated employees to verify immediate access revocation." },
          { id: "c4.2.3", text: "Review Data Backup and Disaster Recovery (DR): Require documented evidence of successful full-system restoration tests." },
          { id: "c4.2.4", text: "Assess compliance with UAE PDPL and healthcare data laws regarding the storage, encryption, and transmission of student/clinical data." },
          { id: "c4.2.5", text: "Audit Third-Party Vendor Risk: Review SOC 2 reports for critical cloud service providers." },
          { id: "c4.2.6", text: "Evaluate physical security controls of the primary server room." },
          { id: "c4.2.7", text: "Review the results of employee phishing simulation campaigns and mandatory training completion." }
        ]
      },
      {
        id: "a4.3",
        title: "Sub-Domain 4.3: Human Resources & Faculty Credentialing",
        target: "Shared Services (Senior HR Executive)",
        risk: "High",
        criteria: [
          { id: "c4.3.1", text: "Primary Source Verification (PSV): Sample medical faculty files to ensure degrees and DHA/MOHAP licenses are validated via primary sources." },
          { id: "c4.3.2", text: "Review onboarding checklists: Ensure background checks and safeguarding training are completed before the start date." },
          { id: "c4.3.3", text: "Audit payroll processing: Reconcile payroll records against the master employee list to check for ghost employees or unauthorized allowances." },
          { id: "c4.3.4", text: "Evaluate the administration and completion rates of the annual performance appraisal process." },
          { id: "c4.3.5", text: "Audit the Faculty Promotion Committee process: Verify promotions follow documented criteria." },
          { id: "c4.3.6", text: "Review exit interview data to identify systemic trends regarding staff turnover." },
          { id: "c4.3.7", text: "Verify the tracking and enforcement of mandatory Continuing Medical Education (CME) credits for clinical faculty." }
        ]
      },
      {
        id: "a4.4",
        title: "Sub-Domain 4.4: Facilities Management, HSE & PR",
        target: "Shared Services (Operations Manager, Marketing & PR, HSE Officer)",
        risk: "Medium",
        criteria: [
          { id: "c4.4.1", text: "Check biohazard and sharps disposal protocols: Ensure contracts with certified vendors are active and logs are maintained." },
          { id: "c4.4.2", text: "Verify the completion of mandatory emergency response, chemical spill, and fire safety drills." },
          { id: "c4.4.3", text: "Audit preventative maintenance schedules for critical campus infrastructure (HVAC, labs)." },
          { id: "c4.4.4", text: "Review Security Guard contract SLAs and audit physical access logs/CCTV coverage for sensitive areas." },
          { id: "c4.4.5", text: "Audit Marketing & PR: Review public-facing materials to ensure claims regarding university rankings are factually accurate." },
          { id: "c4.4.6", text: "Evaluate the university's environmental sustainability initiatives against stated institutional goals." }
        ]
      }
    ]
  },
  {
    id: "d5",
    title: "Domain 5: Research & Post-Graduate Education",
    subdomains: [
      {
        id: "a5.1",
        title: "Sub-Domain 5.1: Research Ethics, Grant Management & IP",
        target: "Vice Chancellor – Research & Post Graduate Education, IRB, IP Specialist",
        risk: "High",
        criteria: [
          { id: "c5.1.1", text: "Audit the IRB Process: Sample active clinical research projects to ensure formal IRB approval was granted prior to patient/data collection." },
          { id: "c5.1.2", text: "Review Conflict of Interest (COI) declarations specific to researchers." },
          { id: "c5.1.3", text: "Review Grant Financial Management: Trace expenditures to ensure funds are used strictly for intended research purposes." },
          { id: "c5.1.4", text: "Audit grant milestone reporting to ensure researchers are meeting deliverables required by external funding agencies." },
          { id: "c5.1.5", text: "Assess Intellectual Property controls: Review the workflow for declaring new inventions and filing patents." },
          { id: "c5.1.6", text: "Evaluate Graduate Education: Verify that post-graduate admissions criteria are strictly followed." },
          { id: "c5.1.7", text: "Review the composition of graduate thesis defense committees to ensure neutrality and required expertise." },
          { id: "c5.1.8", text: "Verify the mandatory use of advanced plagiarism detection tools on all final graduate theses prior to defense." }
        ]
      }
    ]
  }
];

// Enrich data with advanced fields
const initializeData = (data) => {
  return data.map(domain => ({
    ...domain,
    subdomains: domain.subdomains.map(subdomain => ({
      ...subdomain,
      criteria: subdomain.criteria.map(criterion => ({
        ...criterion,
        status: 'Not Started', // Not Started, In Progress, Compliant, Partially Compliant, Non-Compliant, N/A
        comment: ''
      }))
    }))
  }));
};

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Compliant', 'Partially Compliant', 'Non-Compliant', 'N/A'];
const ACADEMIC_YEARS = ['2024-2025', '2025-2026', '2026-2027', '2027-2028', '2028-2029'];

const getProjectId = (year) => `main_audit_${year}`;

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedSubdomains, setExpandedSubdomains] = useState({});
  const [academicYear, setAcademicYear] = useState('');
  const [fieldworkDomainFilter, setFieldworkDomainFilter] = useState('All');
  
  // Auth State
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [userEmail, setUserEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const isAuthenticated = !!session;
  const isAdmin = userRole === 'admin';

  const searchParams = new URLSearchParams(window.location.search);
  const isPublicReport = searchParams.get('public') === 'true';

  useEffect(() => {
    if (isPublicReport) {
      setActiveTab('report');
    }
  }, [isPublicReport]);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Report Filters
  const [reportFilters, setReportFilters] = useState({
    risk: 'All',
    status: 'All',
    domain: 'All'
  });

  // 0. Auth Session Listener
  useEffect(() => {
    // Check for existing session on page load
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s) {
        setSession(s);
        setUserEmail(s.user.email);
        fetchUserRole(s.user.id);
      }
      setAuthReady(true);
    });

    // Listen ONLY for sign-out and token refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUserRole('user');
        setUserEmail('');
        setData([]);
      } else if (event === 'TOKEN_REFRESHED' && s) {
        setSession(s);
      }
      // We do NOT handle SIGNED_IN or INITIAL_SESSION here 
      // because handleLogin sets the session explicitly.
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user role from user_roles table
  const fetchUserRole = async (userId) => {
    try {
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleData?.role) {
        setUserRole(roleData.role);
      } else {
        setUserRole('user');
      }
    } catch (err) {
      console.warn('Could not fetch role, defaulting to user:', err);
      setUserRole('user');
    }
  };

  // 1. Initial Load from Supabase (with fallback to local data)
  useEffect(() => {
    if (!isAuthenticated && !isPublicReport) {
      setLoading(false);
      return;
    }

    if (!academicYear) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchData = async () => {
      try {
        const { data: records, error } = await supabase
          .from('audit_projects')
          .select('state')
          .eq('id', getProjectId(academicYear))
          .single();

        
        let parsedState = records?.state;
        if (parsedState && Array.isArray(parsedState)) {
          // Migration from audits->subdomains and checklist->criteria
          parsedState = parsedState.map(domain => {
            let subdomains = domain.subdomains || domain.audits || [];
            subdomains = subdomains.map(sub => {
              let criteria = sub.criteria || sub.checklist || [];
              const { checklist, ...restSub } = sub;
              return { ...restSub, criteria };
            });
            const { audits, ...restDomain } = domain;
            return { ...restDomain, subdomains };
          });
        }

        if (parsedState && parsedState.length > 0) {
          setData(parsedState);
        } else {
          console.warn('No data from Supabase, using local initial data.');
          const enriched = initializeData(rawInitialData);
          setData(enriched);
          if (isAdmin) {
            try { await saveToSupabase(enriched); } catch(e) { /* ignore */ }
          }
        }
      } catch (err) {
        console.error('Supabase fetch failed, using local data:', err);
        const enriched = initializeData(rawInitialData);
        setData(enriched);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, academicYear]); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Save function
  const saveToSupabase = async (currentData) => {
    if (!isAuthenticated) return; // Prevent public visitors from saving, but allow all logged-in users (admins + users) to save

    try {
      const { error } = await supabase
        .from('audit_projects')
        .upsert({ id: getProjectId(academicYear), state: currentData, updated_at: new Date() });
      
      if (error) throw error;
    } catch (err) {
      console.error('Save error:', err);
      triggerToast("Error saving to database!");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const { data: loginData, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPass,
      });
      if (error) {
        setLoginError(error.message);
      } else if (loginData?.session) {
        // Explicitly set session from the login response
        setSession(loginData.session);
        setUserEmail(loginData.session.user.email);
        await fetchUserRole(loginData.session.user.id);
      }
    } catch (err) {
      setLoginError('An unexpected error occurred.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserRole('user');
    setUserEmail('');
    setData([]);
  };


  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const exportToExcel = () => {
    const flatData = [];
    data.forEach(domain => {
      const audits = domain.subdomains || [];
      if (audits.length === 0) {
        flatData.push({
          'Domain ID': domain.id,
          'Domain': domain.title,
          'Sub-domain ID': '', 'Sub-Domain': '', 'Target': '', 'Risk': '',
          'Criteria ID': '', 'Criteria': '', 'Status': '', 'Comment': ''
        });
      } else {
        audits.forEach(subdomain => {
          const checklist = subdomain.criteria || [];
          if (checklist.length === 0) {
            flatData.push({
              'Domain ID': domain.id,
              'Domain': domain.title,
              'Sub-domain ID': subdomain.id,
              'Sub-Domain': subdomain.title,
              'Target': subdomain.target,
              'Risk': subdomain.risk,
              'Criteria ID': '', 'Criteria': '', 'Status': '', 'Comment': ''
            });
          } else {
            checklist.forEach(criterion => {
              flatData.push({
                'Domain ID': domain.id,
                'Domain': domain.title,
                'Sub-domain ID': subdomain.id,
                'Sub-Domain': subdomain.title,
                'Target': subdomain.target,
                'Risk': subdomain.risk,
                'Criteria ID': criterion.id,
                'Criteria': criterion.text,
                'Status': criterion.status,
                'Comment': criterion.comment
              });
            });
          }
        });
      }
    });
    
    const headers = [
      'Domain ID', 'Domain', 'Sub-domain ID', 'Sub-Domain', 
      'Target', 'Risk', 'Criteria ID', 'Criteria', 'Status', 'Comment'
    ];
    const ws = XLSX.utils.json_to_sheet(flatData, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Audit Plan");
    XLSX.writeFile(wb, `Audit_Plan_${academicYear}.xlsx`);
  };

  const importFromExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const flatData = XLSX.utils.sheet_to_json(ws);

        const domainMap = {};
        flatData.forEach(row => {
          const dId = row['Domain ID'] || `d${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          if (!domainMap[dId]) {
            domainMap[dId] = {
              id: dId,
              title: row['Domain'] || 'New Domain',
              subdomains: []
            };
          }
          const d = domainMap[dId];

          if (row['Sub-domain ID'] || row['Sub-Domain']) {
            const aId = row['Sub-domain ID'] || `a${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            let subdomain = d.subdomains.find(a => a.id === aId);
            if (!subdomain) {
              subdomain = {
                id: aId,
                title: row['Sub-Domain'] || 'New Sub-Domain',
                target: row['Target'] || '',
                risk: row['Risk'] || 'Medium',
                criteria: []
              };
              d.subdomains.push(subdomain);
            }

            if (row['Criteria ID'] || row['Criteria']) {
              const cId = row['Criteria ID'] || `c${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              let criterion = subdomain.criteria.find(c => c.id === cId);
              if (!criterion) {
                subdomain.criteria.push({
                  id: cId,
                  text: row['Criteria'] || '',
                  status: row['Status'] || 'Not Started',
                  comment: row['Comment'] || ''
                });
              }
            }
          }
        });

        const newData = Object.values(domainMap);
        updateAndSync(newData);
        triggerToast("Imported successfully from Excel!");
      } catch (error) {
        console.error("Error parsing Excel:", error);
        triggerToast("Failed to import Excel file.");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // Reset input
  };

  // Helper to update state and sync with Supabase
  const updateAndSync = (newData) => {
    setData(newData);
    saveToSupabase(newData);
  };

  // Helper to update a specific item's field (status, text, comment)
  const updateCriterion = (domainId, subdomainId, criterionId, field, value) => {
    const newData = data.map(domain => {
      if (domain.id !== domainId) return domain;
      return {
        ...domain,
        subdomains: domain.subdomains.map(subdomain => {
          if (subdomain.id !== subdomainId) return subdomain;
          return {
            ...subdomain,
            criteria: subdomain.criteria.map(criterion => {
              if (criterion.id !== criterionId) return criterion;
              return { ...criterion, [field]: value };
            })
          };
        })
      };
    });
    updateAndSync(newData);
  };

  // --- Admin Structural Handlers ---
  const updateDomain = (domainId, field, value) => {
    const newData = data.map(d => d.id === domainId ? { ...d, [field]: value } : d);
    updateAndSync(newData);
  };
  
  const addDomain = () => {
    const newDomain = { id: `d${Date.now()}`, title: "New Domain", subdomains: [] };
    const newData = [...data, newDomain];
    updateAndSync(newData);
  };
  
  const deleteDomain = (domainId) => {
    const newData = data.filter(d => d.id !== domainId);
    updateAndSync(newData);
  };

  const updateSubdomain = (domainId, subdomainId, field, value) => {
    const newData = data.map(d => d.id === domainId ? {
      ...d, subdomains: d.subdomains.map(a => a.id === subdomainId ? { ...a, [field]: value } : a)
    } : d);
    updateAndSync(newData);
  };

  const addSubdomain = (domainId) => {
    const newAudit = {
      id: `a${Date.now()}`,
      title: "New Sub-Domain",
      target: "Target Area",
      risk: "Medium",
      criteria: []
    };
    const newData = data.map(d => d.id === domainId ? { ...d, subdomains: [...d.subdomains, newAudit] } : d);
    updateAndSync(newData);
  };

  const deleteSubdomain = (domainId, subdomainId) => {
    const newData = data.map(d => d.id === domainId ? { ...d, subdomains: d.subdomains.filter(a => a.id !== subdomainId) } : d);
    updateAndSync(newData);
  };

  const addCriterion = (domainId, subdomainId) => {
    const newItem = { id: `c${Date.now()}`, text: "New criteria requirement...", status: 'Not Started', comment: '' };
    const newData = data.map(d => d.id === domainId ? {
      ...d, subdomains: d.subdomains.map(a => a.id === subdomainId ? { ...a, criteria: [...a.criteria, newItem] } : a)
    } : d);
    updateAndSync(newData);
  };

  const deleteCriterion = (domainId, subdomainId, criterionId) => {
    const newData = data.map(d => d.id === domainId ? {
      ...d, subdomains: d.subdomains.map(a => a.id === subdomainId ? { ...a, criteria: a.criteria.filter(c => c.id !== criterionId) } : a)
    } : d);
    updateAndSync(newData);
  };

  const toggleSubdomainAccordion = (subdomainId) => {
    setExpandedSubdomains(prev => ({ ...prev, [subdomainId]: !prev[subdomainId] }));
  };

  const handleShareLink = () => {
    const liveUrl = `${window.location.origin}${window.location.pathname}?public=true`;
    navigator.clipboard.writeText(liveUrl);
    triggerToast("Public report link copied to clipboard!");
  };

  // Color Helpers (must be before any early returns)
  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Medium': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Compliant': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Partially Compliant': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Non-Compliant': return 'bg-red-100 text-red-800 border-red-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'N/A': return 'bg-slate-200 text-slate-800 border-slate-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  // Calculate Progress Stats
  const stats = useMemo(() => {
    // Return early if data is missing
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { overallProgress: 0, completedItems: 0, totalItems: 0, domainProgress: [] };
    }
    
    let totalItems = 0;
    let completedItems = 0;
    
    const isDone = (status) => ['Compliant', 'Partially Compliant', 'Non-Compliant', 'N/A'].includes(status);

    try {
      const domainProgress = data.map(domain => {
        let dTotal = 0;
        let dCompleted = 0;
        
        // Safety check for audits
        const audits = domain.subdomains || [];
        
        audits.forEach(subdomain => {
          // Safety check for checklist
          const checklist = subdomain.criteria || [];
          
          checklist.forEach(criterion => {
            dTotal++;
            totalItems++;
            if (isDone(criterion.status)) {
              dCompleted++;
              completedItems++;
            }
          });
        });

        return { 
          id: domain.id, 
          title: domain.title || "Untitled Domain", 
          progress: dTotal === 0 ? 0 : Math.round((dCompleted / dTotal) * 100),
          completed: dCompleted,
          total: dTotal
        };
      });

      return {
        overallProgress: totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100),
        completedItems,
        totalItems,
        domainProgress
      };
    } catch (err) {
      console.error("Stats calculation error:", err);
      return { overallProgress: 0, completedItems: 0, totalItems: 0, domainProgress: [] };
    }
  }, [data]);

  // Filter Data for Report (must be before early returns - React Rules of Hooks)
  const filteredReportData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter(domain => reportFilters.domain === 'All' || domain.id === reportFilters.domain).map(domain => {
      const audits = domain.subdomains || [];
      const filteredSubdomains = audits.map(subdomain => {
        if (reportFilters.risk !== 'All' && subdomain.risk !== reportFilters.risk) return null;
        
        const checklist = subdomain.criteria || [];
        const filteredCriteria = checklist.filter(criterion => {
          if (reportFilters.status === 'All') return true;
          return criterion.status === reportFilters.status;
        });

        if (filteredCriteria.length === 0 && reportFilters.status !== 'All') return null;

        return { ...subdomain, criteria: filteredCriteria };
      }).filter(Boolean);

      return { ...domain, subdomains: filteredSubdomains };
    }).filter(domain => (domain.subdomains || []).length > 0);
  }, [data, reportFilters]);

  // --- EARLY RETURNS (all hooks must be above this line) ---

  if (!authReady) {
    return (
      <div className="fixed inset-0 w-full h-full bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Building className="w-12 h-12 text-blue-400 mx-auto animate-pulse mb-4" />
          <p className="text-slate-400">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicReport) {
    return (
      <div className="fixed inset-0 w-full h-full bg-slate-900 flex items-center justify-center p-4 z-[9999]">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 p-8 text-center">
            <Building className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">DMU Audit Portal</h2>
            <p className="text-blue-100 text-sm mt-2">Internal Audit Management System</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => { setLoginPass(e.target.value); setLoginError(''); }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              {loginError && <p className="text-red-500 text-xs font-medium bg-red-50 p-3 rounded-lg border border-red-200">{loginError}</p>}
              <button 
                type="submit"
                disabled={loginLoading}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="text-xs text-center text-gray-400 mt-6">Contact your administrator for login credentials.</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <Building className="w-12 h-12 text-blue-400 mx-auto animate-pulse mb-4" />
          <h2 className="text-xl font-bold">Loading Audit Dashboard...</h2>
          <p className="text-slate-400 mt-2">Connecting to Supabase Database</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 animate-bounce print:hidden">
          <LinkIcon className="w-4 h-4" />
          <span className="font-medium text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Sidebar - Hidden on Print and Public Report */}
      {!isPublicReport && (
        <aside className="w-64 bg-slate-900 text-white flex flex-col print:hidden">
          <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xl font-bold mb-1">
            <Building className="w-6 h-6 text-blue-400" />
            <span>DMU Audit</span>
          </div>
          <p className="text-xs text-slate-400">Internal Audit Manager</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('audits')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'audits' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <ClipboardCheck className="w-5 h-5" />
            <span>Fieldwork Checks</span>
          </button>
          <button 
            onClick={() => setActiveTab('report')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'report' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            <span>Live Report</span>
          </button>
        </nav>
        
        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg ${isAdmin ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'}`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-tighter">{userRole}</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{userEmail}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 py-2 rounded-lg transition-all"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Academic Year</label>
            <select 
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full bg-slate-800 text-white text-sm rounded border border-slate-700 p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="" disabled>Select Year</option>
              {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 print:bg-white print:w-full print:absolute print:left-0 print:top-0">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="p-8 max-w-5xl mx-auto print:hidden">
            <header className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Audit Plan Dashboard</h1>
                <p className="text-gray-500 mt-2">Dubai Medical University - FY {academicYear || 'Not Selected'}</p>
              </div>
              <button onClick={handleShareLink} className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition border border-blue-200">
                <LinkIcon className="w-4 h-4" />
                <span>Share Live Link</span>
              </button>
            </header>

            {!academicYear ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                <AlertCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800">No Academic Year Selected</h3>
                <p className="text-gray-500 mt-2">Please select an academic year from the sidebar to begin.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                    <div className="text-5xl font-bold text-blue-600 mb-2">{stats.overallProgress}%</div>
                    <div className="text-gray-500 font-medium">Plan Completed</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                    <div className="text-5xl font-bold text-emerald-600 mb-2">{stats.completedItems}</div>
                    <div className="text-gray-500 font-medium">Items Finalized</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center">
                    <div className="text-5xl font-bold text-slate-700 mb-2">{stats.totalItems - stats.completedItems}</div>
                    <div className="text-gray-500 font-medium">Items Pending</div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-4">Progress by Domain</h2>
                <div className="space-y-4">
                  {stats.domainProgress.map(domain => (
                    <div key={domain.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-800">{domain.title}</h3>
                        <span className="text-sm font-semibold bg-gray-100 text-gray-600 py-1 px-3 rounded-full">
                          {domain.completed} / {domain.total} Done
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${domain.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-sm font-medium text-gray-500">{domain.progress}%</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* AUDITS / FIELDWORK TAB */}
        {activeTab === 'audits' && (
          <div className="p-8 max-w-5xl mx-auto print:hidden">
            <header className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fieldwork Checklists</h1>
                <p className="text-gray-500 mt-2">Evaluate controls, set status rubrics, and record findings.</p>
              </div>
              <div className="flex flex-col items-end">
                {isAdmin ? (
                  <>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest rounded flex items-center mb-2">
                      <Edit3 className="w-3 h-3 mr-1" /> Admin Edit Mode
                    </span>
                    <div className="flex space-x-2 mt-2">
                      <button 
                        onClick={exportToExcel}
                        className="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
                      >
                        <FileText className="w-4 h-4 mr-1" /> Export
                      </button>
                      <label className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition cursor-pointer">
                        <Printer className="w-4 h-4 mr-1" /> Import
                        <input type="file" accept=".xlsx, .xls" className="hidden" onChange={importFromExcel} />
                      </label>
                    </div>
                  </>
                ) : (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest rounded flex items-center mb-2">
                    <ShieldAlert className="w-3 h-3 mr-1" /> View Only Mode
                  </span>
                )}
              </div>
            </header>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center space-x-2 text-gray-500 font-medium">
                <Filter className="w-5 h-5" />
                <span>Filters:</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Academic Year:</label>
                <select 
                  value={academicYear} 
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 p-2"
                >
                  <option value="" disabled>Select Year</option>
                  {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Domain:</label>
                <select 
                  value={fieldworkDomainFilter} 
                  onChange={(e) => setFieldworkDomainFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 p-2 max-w-xs"
                >
                  <option value="All">All Domains</option>
                  {data.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
              </div>
            </div>

            {!academicYear ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                <AlertCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800">No Academic Year Selected</h3>
                <p className="text-gray-500 mt-2">Please select an academic year from the filters above to begin.</p>
              </div>
            ) : (
            <div className="space-y-8">
              {data.filter(domain => fieldworkDomainFilter === 'All' || domain.id === fieldworkDomainFilter).map(domain => (
                <div key={domain.id} className="mb-8">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-slate-200">
                    {isAdmin ? (
                      <div className="flex items-center space-x-2 w-full">
                        <input 
                          value={domain.title} 
                          onChange={(e) => updateDomain(domain.id, 'title', e.target.value)} 
                          className="text-xl font-bold text-slate-800 bg-white border border-blue-300 rounded px-2 py-1 flex-1 outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                        <button onClick={() => deleteDomain(domain.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors" title="Delete Domain">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <h2 className="text-xl font-bold text-slate-800">
                        {domain.title}
                      </h2>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {domain.subdomains.map(subdomain => {
                      const isExpanded = expandedSubdomains[subdomain.id];
                      const isFullyComplete = subdomain.criteria.length > 0 && subdomain.criteria.every(c => ['Compliant', 'Partially Compliant', 'Non-Compliant', 'N/A'].includes(c.status));

                      return (
                        <div key={subdomain.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${isFullyComplete && !isAdmin ? 'border-emerald-200' : 'border-gray-200'}`}>
                          
                          {/* Accordion Header */}
                          <div 
                            className={`p-5 flex justify-between items-start ${isFullyComplete && !isAdmin ? 'bg-emerald-50/30' : ''}`}
                          >
                            <div className="flex-1 pr-4 cursor-pointer" onClick={() => toggleSubdomainAccordion(subdomain.id)}>
                              <div className="flex items-start space-x-3 mb-1 flex-col md:flex-row md:items-center">
                                {isAdmin ? (
                                  <input 
                                    value={subdomain.title} 
                                    onChange={(e) => updateSubdomain(domain.id, subdomain.id, 'title', e.target.value)} 
                                    className="font-bold text-lg text-gray-900 border border-blue-300 rounded px-2 py-1 w-full flex-1 mb-2 md:mb-0 outline-none focus:ring-2 focus:ring-blue-500" 
                                  />
                                ) : (
                                  <h3 className={`font-bold text-lg ${isFullyComplete ? 'text-emerald-800' : 'text-gray-900'}`}>
                                    {subdomain.title}
                                  </h3>
                                )}
                                
                                {isAdmin ? (
                                  <select 
                                    value={subdomain.risk} 
                                    onChange={(e) => updateSubdomain(domain.id, subdomain.id, 'risk', e.target.value)}
                                    className="text-sm font-medium border border-blue-300 rounded p-1.5 outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                  </select>
                                ) : (
                                  <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap mt-2 md:mt-0 ${getRiskColor(subdomain.risk)}`}>
                                    {subdomain.risk} Risk
                                  </span>
                                )}
                              </div>
                              
                              <div className="mt-2 text-sm text-gray-500 flex items-center">
                                <strong className="mr-2">Target:</strong>
                                {isAdmin ? (
                                  <input 
                                    value={subdomain.target} 
                                    onChange={(e) => updateSubdomain(domain.id, subdomain.id, 'target', e.target.value)} 
                                    className="flex-1 border border-blue-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500" 
                                  />
                                ) : (
                                  <span>{subdomain.target}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-2 md:mt-0">
                              {isAdmin && (
                                <button onClick={(e) => { e.stopPropagation(); deleteSubdomain(domain.id, subdomain.id); }} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors" title="Delete Sub-Domain">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                              <button onClick={() => toggleSubdomainAccordion(subdomain.id)} className="p-1 hover:bg-gray-100 rounded">
                                {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                              </button>
                            </div>
                          </div>

                          {/* Accordion Body (Checklist) */}
                          {isExpanded && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                              <ul className="space-y-4">
                                {subdomain.criteria.map(criterion => (
                                  <li 
                                    key={criterion.id}
                                    className={`p-4 rounded-lg border transition-all ${criterion.status === 'Compliant' ? 'bg-emerald-50/30 border-emerald-200' : criterion.status === 'Partially Compliant' ? 'bg-yellow-50/30 border-yellow-200' : criterion.status === 'Non-Compliant' ? 'bg-red-50/30 border-red-200' : 'bg-white border-gray-200 shadow-sm'}`}
                                  >
                                    <div className="flex flex-col md:flex-row md:items-start space-y-3 md:space-y-0 md:space-x-4">
                                      <div className="flex-shrink-0 w-full md:w-44">
                                        <select
                                          value={criterion.status}
                                          disabled={!isAuthenticated}
                                          onChange={(e) => updateCriterion(domain.id, subdomain.id, criterion.id, 'status', e.target.value)}
                                          className={`w-full text-sm font-semibold rounded p-2 border outline-none cursor-pointer ${getStatusColor(criterion.status)} disabled:opacity-80 disabled:cursor-not-allowed`}
                                        >
                                          {STATUS_OPTIONS.map(opt => (
                                            <option key={opt} value={opt} className="bg-white text-gray-900">{opt}</option>
                                          ))}
                                        </select>
                                      </div>

                                      <div className="flex-1 flex items-start space-x-2">
                                        {isAdmin ? (
                                          <textarea 
                                            value={criterion.text}
                                            onChange={(e) => updateCriterion(domain.id, subdomain.id, criterion.id, 'text', e.target.value)}
                                            className="w-full text-sm text-gray-900 bg-white border border-blue-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-y min-h-[60px]"
                                            placeholder="Edit checklist requirement..."
                                          />
                                        ) : (
                                          <div className={`w-full text-sm leading-relaxed ${['Compliant', 'N/A'].includes(criterion.status) ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                                            {criterion.text}
                                          </div>
                                        )}
                                        {isAdmin && (
                                          <button onClick={() => deleteCriterion(domain.id, subdomain.id, criterion.id)} className="text-red-400 hover:text-red-600 p-1 flex-shrink-0" title="Delete Item">
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-start space-x-2">
                                      <MessageSquare className="w-4 h-4 text-slate-400 mt-2 flex-shrink-0" />
                                      <textarea
                                        value={criterion.comment}
                                        readOnly={!isAuthenticated}
                                        onChange={(e) => updateCriterion(domain.id, subdomain.id, criterion.id, 'comment', e.target.value)}
                                        placeholder={isAuthenticated ? "Add findings/evidence..." : "No findings recorded."}
                                        className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded p-2 focus:ring-1 focus:ring-blue-400 outline-none resize-y min-h-[60px] read-only:bg-transparent read-only:border-transparent"
                                      />
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              
                              {isAdmin && (
                                <button onClick={() => addCriterion(domain.id, subdomain.id)} className="mt-4 flex items-center space-x-2 text-sm text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg border border-dashed border-blue-300 w-full justify-center transition-colors">
                                  <Plus className="w-4 h-4" />
                                  <span className="font-medium">Add New Checklist Item</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {isAdmin && (
                      <button onClick={() => addSubdomain(domain.id)} className="flex items-center space-x-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg border border-dashed border-slate-300 w-full justify-center transition-colors">
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">Add New Audit Engagement</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isAdmin && (
                <div className="pt-4 border-t-2 border-dashed border-slate-200">
                  <button onClick={addDomain} className="flex items-center space-x-2 text-base text-blue-600 bg-blue-50 hover:bg-blue-100 px-6 py-4 rounded-xl border border-dashed border-blue-300 w-full justify-center transition-colors shadow-sm">
                    <Plus className="w-5 h-5" />
                    <span className="font-bold">Add New Domain</span>
                  </button>
                </div>
              )}
            </div>
            )}
          </div>
        )}

        {/* REPORT TAB (Filterable & Printable) */}
        {activeTab === 'report' && (
          <div className="p-8 max-w-5xl mx-auto print:p-0 print:max-w-none">
            
            <div className="mb-8 print:hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Live Presentation Report</h1>
                  <p className="text-gray-500 mt-1">Filter, review, and share the comprehensive findings.</p>
                </div>
                <div className="flex space-x-3">
                  <button onClick={handleShareLink} className="flex items-center space-x-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg shadow-sm font-medium transition-colors">
                    <LinkIcon className="w-5 h-5" />
                    <span>Copy Link</span>
                  </button>
                  <button onClick={() => window.print()} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm font-medium transition-colors">
                    <Printer className="w-5 h-5" />
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>

              {!academicYear ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <AlertCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-800">No Academic Year Selected</h3>
                  <p className="text-gray-500 mt-2">Please select an academic year from the sidebar to begin.</p>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-6">
                    <div className="flex items-center space-x-2 text-gray-500 font-medium">
                      <Filter className="w-5 h-5" />
                      <span>Filters:</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Academic Year:</label>
                      <select 
                        value={academicYear} 
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 p-2"
                      >
                        <option value="" disabled>Select Year</option>
                        {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Domain:</label>
                      <select 
                        value={reportFilters.domain} 
                        onChange={(e) => setReportFilters(prev => ({...prev, domain: e.target.value}))}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 p-2 max-w-xs"
                      >
                        <option value="All">All Domains</option>
                        {data.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Risk Level:</label>
                      <select 
                        value={reportFilters.risk} 
                        onChange={(e) => setReportFilters(prev => ({...prev, risk: e.target.value}))}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 p-2"
                      >
                        <option value="All">All Risks</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Status Rubric:</label>
                      <select 
                        value={reportFilters.status} 
                        onChange={(e) => setReportFilters(prev => ({...prev, status: e.target.value}))}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 p-2"
                      >
                        <option value="All">All Statuses</option>
                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 print:border-none print:shadow-none print:p-4">
              
              <div className="text-center mb-10 border-b-2 border-slate-800 pb-8">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Dubai Medical University</h1>
                <h2 className="text-2xl font-light text-slate-600">Internal Audit Fieldwork Report</h2>
                <h3 className="text-lg font-medium text-slate-500 mt-2">Academic Year: {academicYear}</h3>
                
                <div className="mt-6 flex justify-center space-x-8">
                  <div className="text-center">
                    <span className="block text-sm text-slate-500 uppercase tracking-widest">Progress</span>
                    <span className="text-2xl font-bold text-blue-600">{stats.overallProgress}%</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-sm text-slate-500 uppercase tracking-widest">Report View</span>
                    <span className="text-2xl font-bold text-slate-700 capitalize">
                      {reportFilters.risk === 'All' && reportFilters.status === 'All' ? 'Comprehensive' : 'Filtered'}
                    </span>
                  </div>
                </div>
              </div>

              {filteredReportData.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No results match the current filters.</p>
                  <p className="text-sm">Try adjusting the Risk Level or Status Rubric above.</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-6 uppercase tracking-wider border-b pb-2">Audit Findings & Status</h3>
                  
                  {filteredReportData.map(domain => (
                    <div key={domain.id} className="mb-10 break-inside-avoid">
                      <h4 className="text-lg font-bold text-blue-900 mb-4 bg-blue-50 p-3 rounded">
                        {domain.title}
                      </h4>
                      
                      <div className="space-y-8">
                        {domain.subdomains.map(subdomain => (
                          <div key={subdomain.id} className="pl-4 border-l-4 border-slate-200">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-bold text-slate-800 text-md">{subdomain.title}</h5>
                                <p className="text-xs text-slate-500 mt-0.5"><strong>Target:</strong> {subdomain.target}</p>
                              </div>
                              <span className={`inline-block px-3 py-1 rounded text-xs font-bold border ${getRiskColor(subdomain.risk)}`}>
                                {subdomain.risk} Risk
                              </span>
                            </div>
                            
                            <div className="space-y-4 mt-4">
                              {subdomain.criteria.map(criterion => (
                                <div key={criterion.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                  <div className="flex items-start space-x-3 mb-2">
                                    <span className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(criterion.status)}`}>
                                      {criterion.status}
                                    </span>
                                    <p className="text-sm text-slate-800 font-medium leading-relaxed">
                                      {criterion.text}
                                    </p>
                                  </div>
                                  
                                  {criterion.comment && (
                                    <div className="ml-16 mt-2 pt-2 border-t border-gray-200 flex items-start space-x-2">
                                      <MessageSquare className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                                      <p className="text-xs text-slate-600 italic whitespace-pre-wrap">
                                        {criterion.comment}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-16 pt-8 border-t border-slate-300 text-center text-sm text-slate-500 flex justify-between">
                <span>Prepared By: Chief Audit Executive</span>
                <span>Generated via DMU Audit Dashboard</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

            </div>
            </>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
