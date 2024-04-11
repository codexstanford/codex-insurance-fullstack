const EPILOG_RULESET_STRING = `
covered(C):-
    claim.policy(C,P) &
    policy.type(P,T) &
    covered_under_policy(C,P,T).

covered_under_policy(C,P,cardinal):-
    valid_insuree(C,P) &
    policy_active(C,P) &
    valid_hospitalization(C,P).

valid_insuree(C,P):-
    claim.claimant(C,Cl) &
    policy.insuree(P,Cl).

% check if the policy is active
policy_active(C,P):-
  claim.claimant(C,Cl) &
  claim.hosp_start_time(C,H_START_DATE,H_START_TIME) & 
  claim.hosp_end_time(C,H_END_DATE,H_END_TIME) &
  policy.startdate(P,Cl,P_START_DATE) &
  policy.enddate(P,Cl,P_END_DATE) &
  get_timestamp_from_date(H_START_DATE,H_START_STAMP) &
  get_timestamp_from_date(H_END_DATE,H_END_STAMP) &
  get_timestamp_from_date(P_END_DATE,P_END_STAMP) &
  get_timestamp_from_date(P_START_DATE,P_START_STAMP) &
  leq(P_START_STAMP,H_START_STAMP) &
  leq(H_END_STAMP,P_END_STAMP)

% check if the hospitali is valid and the service is covered
valid_hospitalization(C,P):-
  claim.hospital(C,Hosp) &
  valid_hospital(Hosp) &
  claim.reason(C,R) &
  eligible_service(C,P,R) &
  ~exception(C,P).

%% seperate rule for emergency room as out of network hospitals are covered
valid_hospitalization(C,P):-
  claim.reason(C,emergency_room) &
  claim.type_of_care(C,emergency) &
  ~exception(C,P).


%%% Services that have location restriction and visit limit in the policy year

%%%%%%%%%%%%%%%%%%% Eligible Services %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% yearly limit and location
eligible_service(C,P,Service):-
  check_policy_year_limit(C,Service) &
  claim.location(C,L) &
  valid_location(Service,L).

% location
eligible_service(C,P,X):-
  covered_list_with_location(List) &
  member(X,List) &
  claim.location(C,L) &
  valid_location(X,L).

% no restrictions
eligible_service(C,P,X):-
  covered_list(List) &
  member(X,List).

eligible_service(C,P,specialized_screening_counselling):-
  claim.screening_type(C,Type) &
  valid_screening_list(List) &
  member(Type,List).

eligible_service(C,P,specialized_screening_counselling):-
  claim.screening_type(C,cancer) &
  claim.cancer_type(C,lung) &
  evaluate(countofall(X,lung_cancer_past_twelve_months(C,X)),0). 

eligible_service(C,P,specialized_screening_counselling):-
  claim.screening_type(C,cancer) &
  check_age_range_limit(C,cancer).   

eligible_service(C,P,preventive_care):-
  claim.location(C,L) &
  valid_location(preventive_care,L) &
  check_age_range_limit(C,vaccine).

eligible_service(C,P,preventive_care):-
  claim.location(C,L) &
  valid_location(preventive_care,L) &
  claim.vaccine(C,hep_b) &
  claim.claimant(C,Cl) &
  person.dob(Cl,DOB) &
  claim.hosp_start_time(C,C_D,C_T) &
  get_date_diff(C_D, DOB, Y) &
  get_date_diff_in_months(C_D, DOB, M) &
  age_range_limit_hepb(C,N,Y,M) &
  claim.vaccine_dose_count(C,D) &
  leq(D,N).

eligible_service(C,P,preventive_care):-
  claim.location(C,L) &
  valid_location(preventive_care,L) &
  claim.vaccine(C,covid) &
  claim.claimant(C,Cl) &
  person.dob(Cl,DOB) &
  claim.hosp_start_time(C,C_D,C_T) &
  get_date_diff(C_D, DOB, Y) &
  get_date_diff_in_months(C_D, DOB, M) &
  person.immunocompromised(Cl,Immuno_Status) &
  claim.vaccine_brand(C,Type) &
  claim.previous_vaccines_pfizer(C,Count_P) &
  claim.previous_vaccines_moderna(C,Count_M) &
  claim.previous_vaccines_other(C,Count_O) &
  age_range_limit_covid(C,N,Y,M,Immuno_Status,Type,Count_P,Count_M,Count_O) &
  claim.vaccine_dose_count(C,D) &
  leq(D,N).

% Not implementing as these are recommendations and not mandatory requirements
% LAIV4 should not be used during pregnancy but can be used postpartum. 
% >= 65: recommend inactivated influenza vaccine (HD-IIV4), quadrivalent recombinant influenza vaccine (RIV4), or quadrivalent adjuvanted inactivated influenza vaccine (aIIV4). 
% LAIV4 should not be used for persons with compromised immunity 
eligible_service(C,P,preventive_care):-
  claim.location(C,L) &
  valid_location(preventive_care,L) &
  claim.vaccine(C,flu) &
  claim.claimant(C,Cl) &
  person.dob(Cl,DOB) &
  claim.hosp_start_time(C,C_D,C_T) &
  get_date_diff_in_months(C_D, DOB, M) &
  claim.previous_vaccines_flu_more_than_2(Prev_Count) & % more than 2 vaccine doses till now (not annual)
  age_range_limit_flu(C,N,Min_age,Max_age,Prev_Count) &
  leq(Min_age, M) & leq (M, Max_age) &
  claim.vaccine_dose_count_annual(C,D) &
  leq(D,N).

eligible_service(C,P,female_contraceptives):-
  claim.claimant(C,Cl) &
  claim.contraceptive_service(C,Service) &
  fda_approved(Service) &
  claim.location(C,L) &
  contraceptive_location_check(Service,L).

eligible_service(C,P,inpatient_surgical_services):-
  claim.location(C,L) &
  valid_location(inpatient_surgical_services,L) &
  claim.service_provider(C,O) &
  valid_service_provider(inpatient_surgical_services, O).

eligible_service(C,P,outpatient_surgical_services):-
  claim.location(C,L) &
  valid_location(outpatient_surgical_services,L) &
  claim.service_provider(C,O) &
  valid_service_provider(outpatient_surgical_services, O).


eligible_service(C,P,outpatient_surgery_facility_charges):-
  claim.location(C,L) &
  valid_location(outpatient_surgery_facility_charges,L).

%%%%%%%%%%%%%%%%%%% Range Limit Checks %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%% Age limits for covid vaccines
age_range_limit_covid(C,2,Y,M,no,moderna,0,0,0):-
  leq(Y,4) &
  leq(6,M).

age_range_limit_covid(C,3,Y,M,I,pfizer,0,0,0):-
  leq(Y,4) &
  leq(6,M).

age_range_limit_covid(C,1,Y,M,no,moderna,P_doses,M_doses,O_doses):-
  leq(Y,4) &
  leq(6,M) &
  leq(1,M_doses).

age_range_limit_covid(C,2,Y,M,I,pfizer,1,M_doses,O_doses):-
  leq(Y,4) &
  leq(6,M).

age_range_limit_covid(C,1,Y,M,I,pfizer,P_doses,M_doses,O_doses):-
  leq(Y,4) &
  leq(6,M) &
  leq(2,P_doses).

age_range_limit_covid(C,1,Y,M,no,pfizer,0,0,0):-
  leq(5,Y).

age_range_limit_covid(C,1,Y,M,no,moderna,0,0,0):-
  leq(5,Y).

age_range_limit_covid(C,2,Y,M,I,novovax,0,0,0):-
  leq(5,Y).

age_range_limit_covid(C,1,Y,M,no,V,P_doses,M_doses,O_doses):-
  evaluate(plus(P_doses,M_doses,O_doses),Total) &
  leq(5,Y) &
  leq(1,Total).

age_range_limit_covid(C,3,Y,M,yes,moderna,0,0,0):-
  leq(6,M).

age_range_limit_covid(C,2,Y,M,yes,moderna,P_doses,1,O_doses):-
  leq(6,M).

age_range_limit_covid(C,1,Y,M,yes,moderna,P_doses,M_doses,O_doses):-
  leq(6,M) &
  leq(2,P_doses).

age_range_limit_covid(C,3,Y,M,yes,pfizer,0,0,0):-
  leq(5,Y).

age_range_limit_covid(C,2,Y,M,yes,pfizer,1,M_doses,O_doses):-
  leq(5,Y).

age_range_limit_covid(C,1,Y,M,yes,pfizer,P_doses,M_doses,O_doses):-
  leq(5,Y) &
  leq(2,P_doses).

age_range_limit_covid(C,1,Y,M,yes,V,P_doses,M_doses,O_doses):-
  leq(12,Y) &
  leq(1,O_doses).
  
%%% Age limits for hep_b vaccines

age_range_limit_hepb(C,1,Y,0).

age_range_limit_hepb(C,3,Y,M):-
  leq(2,M) &
  leq(M,5).

age_range_limit_hepb(C,4,Y,M):-
  leq(6,M) &
  leq(Y,17).

age_range_limit_hepb(C,4,18,M):-
  claim.vaccine_brand(C,twinrix).

age_range_limit_hepb(C,4,Y,M):- 
  leq(19,Y) &
  leq(Y,200).

age_range_limit_hepb(C,7,Y,M):-
  leq(Y,2) &
  mother_hbsag_positive_unknown(C) &
  claim.anti_hbs_count(H,Count) &
  leq(Count,10).

mother_hbsag_positive_unknown(C):-
  claim.mother_hbsag(C,positive)

mother_hbsag_positive_unknown(H):-
  claim.mother_hbsag(C,unknown)

age_range_limit_hepb(C,7,Y,M):-
  leq(Y,2) &
  claim.birth_weight(C,Weight) &
  leq(Weight,2000) &
  claim.anti_hbs_count(C,Count) &
  leq(Count,10).

age_range_limit_hepb(C,7,Y,M):-
  claim.claimant(C,Cl) &
  eligible_for_revaccination(Cl) &
  person.occupation(Cl,healthcare_worker) &
  claim.anti_hbs_count(C,Count) &
  leq(Count,10).

eligible_for_revaccination(Cl):-
  person.occupation(Cl,healthcare_worker)

eligible_for_revaccination(Cl):-
  person.condition(Cl,immunocompromised)

eligible_for_revaccination(Cl):-
  person.condition(Cl,hemodialysis_patient).


%%% Age limits for flu vaccines
age_range_limit_flu(C,1,0,20000,PC).
age_range_limit_flu(C,2,6,96,no).
age_range_limit_flu(C,2,6,96,unknown).

% Age limit for cancer
check_age_range_limit(Claim, cancer):- 
  claim.claimant(Claim,Cl) &
  person.dob(Cl,DOB) &
  claim.time(Claim,C_D,C_T) &
  get_date_diff(C_D, DOB, Age) &
  claim.screening_type(Claim,cancer) &
  claim.cancer_type(Claim,Cancer) &
  get_age_range_limit(cancer,Cancer,Age,Limit,MinAge,MaxAge) &
  evaluate(plus(countofall(X,age_range_visit_cancer(Claim,X)),1),Count) &
  leq(Count,Limit).

% Age limit for vaccines
check_age_range_limit(Claim,vaccine):-
  claim.claimant(Claim,Cl) &
  person.dob(Cl,DOB) &
  claim.time(Claim,C_D,C_T) &
  get_date_diff(C_D, DOB, Age) &
  claim.vaccine(Claim,V) &
  get_age_range_limit(vaccine,V,Age,Limit,MinAge,MaxAge) &
  evaluate(plus(countofall(X,age_range_visit_vaccine(Claim,X)),1),Count) &
  leq(Count,Limit).

% check if the two claims are for the same vaccine and within the age range
age_range_visit_vaccine(Claim1,Claim2):-
  claim.claimant(Claim1,Person) &
  claim.claimant(Claim2,Person) &
  claim.policy(Claim1,Policy) &
  claim.policy(Claim2,Policy) &
  claim.reason(Claim1,preventive_care) &
  claim.reason(Claim2,preventive_care) &
  claim.vaccine(Claim1,V) &
  claim.vaccine(Claim2,V) &
  claim.time(Claim1,C1_D,C1_T) &
  person.dob(Person,DOB) &
  get_date_diff(C1_D, DOB, Age) &
  get_age_range_limit(vaccine,V,Age,Limit,MinAge,MaxAge) &
  age_range_visit(Claim1,Claim2,MinAge,MaxAge,DOB).

% check if the two claims are for the same cancer type and within the age range
age_range_visit_cancer(Claim1,Claim2):-
  claim.claimant(Claim1,Person) &
  claim.claimant(Claim2,Person) &
  claim.policy(Claim1,Policy) &
  claim.policy(Claim2,Policy) &
  claim.reason(Claim1,specialized_screening_counselling) &
  claim.reason(Claim2,specialized_screening_counselling) &
  claim.screening_type(Claim1,cancer) &
  claim.screening_type(Claim2,cancer) &
  claim.cancer_type(Claim1,Cancer) &
  claim.cancer_type(Claim2,Cancer) &
  claim.time(Claim1,C1_D,C1_T) &
  person.dob(Person,DOB) &
  get_date_diff(C1_D, DOB, Age) &
  get_age_range_limit(cancer,Cancer,Age,Limit,MinAge,MaxAge) &
  age_range_visit(Claim1,Claim2,MinAge,MaxAge,DOB).

% check if the claim is within the age range
age_range_visit(Claim1,Claim2,MinAge,MaxAge,DOB):-
  claim.time(Claim2,C2_D,C2_T) &
  claim.time(Claim1,C1_D,C1_T) &
  get_date_diff(C2_D, DOB, Age2) &
  leq(Age2,MaxAge) &
  leq(MinAge,Age2) &
  get_timestamp_from_datetime(C1_D,C1_T,C1_TS) &
  get_timestamp_from_datetime(C2_D,C2_T,C2_TS) &
  lt(C2_TS,C1_TS) &
  covered(Claim2). 

get_age_range_limit(Type,Case,Age,Limit,MinAge,MaxAge):-
  age_range_limit(Type,Case,MinAge,MaxAge,Limit) &
  evaluate(minus(MaxAge,1),MaxAgeMinus) &
  leq(Age,MaxAgeMinus) &
  leq(MinAge,Age).

% Visit limit for lung cancer
lung_cancer_past_twelve_months(Claim1,Claim2):-
  claim.claimant(Claim1,Cl) &
  claim.claimant(Claim2,Cl) &
  claim.reason(Claim1,specialized_screening_counselling) &
  claim.reason(Claim2,specialized_screening_counselling) &
  claim.screening_type(Claim1,cancer) &
  claim.screening_type(Claim2,cancer) &
  claim.cancer_type(Claim1,lung) &
  claim.cancer_type(Claim2,lung) &
  evaluate(parsedate(C1_D),[D,M,Y]) &
  evaluate(parsedate(C2_D),[D2,M2,Y2]) &
  get_date_diff(C1_D, C2_D, Age) &
  same(Age, 0)

% Visit limit in general
check_policy_year_limit(C,Service):-
  claim.claimant(C,Cl) &
  person.dob(Cl,DOB) &
  claim.time(C,C_D,C_T) &
  get_date_diff(C_D, DOB, Age) &
  yearly_visit_limit(Service,Age,Limit) &
  evaluate(plus(countofall(X,visit_current_year(Service,C,X)),1),Count) &
  leq(Count,Limit).

yearly_visit_limit(Service,Age,Limit):-
  yearly_visit_limit(Service,MinAge,MaxAge,Limit) &
  evaluate(minus(MaxAge,1),MaxAgeMinus) &
  leq(Age,MaxAgeMinus) &
  leq(MinAge,Age).

visit_current_year(Service,Claim1,Claim2):-
  claim.claimant(Claim1,Person) &
  claim.claimant(Claim2,Person) &
  claim.policy(Claim1,Policy) &
  claim.policy(Claim2,Policy) &
  claim.reason(Claim1,Service) &
  claim.reason(Claim2,Service) &
  claim.hosp_start_time(Claim1,Hosp1_StartDate,Hosp1_StartTime) &
  claim.hosp_start_time(Claim2,Hosp2_StartDate,Hosp2_StartTime) &
  policy_year_startdate(Policy_StartDate) &
  get_timestamp_from_datetime(Hosp2_StartDate,Hosp2_StartTime,Hosp2_Timestamp) &
  get_timestamp_from_date(Policy_StartDate,Policy_Timestamp) &
  get_timestamp_from_datetime(Hosp1_StartDate,Hosp1_StartTime,Hosp1_Timestamp) &
  leq(Policy_Timestamp,Hosp2_Timestamp) &
  leq(Policy_Timestamp,Hosp1_Timestamp) &
  claim.time(Claim1,C1_D,C1_T) &
  claim.time(Claim2,C2_D,C2_T) &
  get_timestamp_from_datetime(C1_D,C1_T,C1_TS) &
  get_timestamp_from_datetime(C2_D,C2_T,C2_TS) &
  lt(C2_TS,C1_TS) 
  % &
  % covered(Claim2)

%%%%%%%%%%%%%%%%%%% Exceptions %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

exception(C,P):-
  claim.claimant(C,Cl) &
  person.occupation(Cl,armed_forces) &
  claim.consequence_of_occupation(C,yes).

exception(C,P):-
  claim.reason(C,home_health_care) &
  home_not_covered_list(List) &
  claim.home_service(C,Service) &
  member(Service,List).

exception(C,P):-
  claim.reason(C,home_health_care) &
  claim.claimant(C,Cl) &
  minor_or_dependent(C,Cl) &
  claim.family_member_present(C,no).

%%%%%%%%%%%%%%%%%%% Helper Functions %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

get_timestamp_from_datetime(DATE,TIME,STAMP) :-
  evaluate(parsedate(DATE),[D,M,Y]) &
  evaluate(parsetime(TIME),[HR,MIN]) &
  evaluate(maketimestamp(Y,M,D,HR,MIN,0),STAMP)

get_timestamp_from_date(DATE,STAMP) :-
  evaluate(parsedate(DATE),[D,M,Y]) &
  evaluate(maketimestamp(Y,M,D,0,0,0),STAMP)

definition(parsedate(DATE),map(readstring,tail(matches(stringify(DATE),"(..)_(..)_(....)"))))
definition(parsetime(TIME),map(readstring,tail(matches(stringify(TIME),"(..)_(..)"))))
definition(tail(X!L),L)

get_date_diff(C_D, C_D2, Age) :-
  evaluate(parsedate(C_D),[D,M,Y]) &
  evaluate(parsedate(C_D2),[D2,M2,Y2]) &
  evaluate(minus(Y,Y2),YearDiff) &
  evaluate(minus(M,M2), MonthDiff) &
  evaluate(minus(D,D2), DayDiff) &
  evaluate(plus(imul(31,MonthDiff), DayDiff), MDDiff) &
  evaluate(plus(YearDiff, if(leq(MDDiff,-1), -1, true, 0)), Age)

get_date_diff_in_months(C_D, DOB, AgeInMonths) :-
  evaluate(parsedate(C_D),[D,M,Y]) &
  evaluate(parsedate(DOB),[D2,M2,Y2]) &
  evaluate(minus(Y,Y2), YearDiff) &
  evaluate(minus(M,M2), MonthDiff) &
  evaluate(minus(D,D2), DayDiff) &
  evaluate(plus(imul(12, YearDiff), MonthDiff), PreliminaryMonths) &
  evaluate(if(leq(DayDiff, -1), minus(PreliminaryMonths, 1), true, PreliminaryMonths), AgeInMonths).

lt(X,Y):-
  leq(X,Y) &
  ~same(X,Y).

minor_or_dependent(C,Cl):-
  person.dependent(Cl,yes).

minor_or_dependent(C,Cl):-
  person.dob(Cl,DOB) &
  claim.time(C,C_D,C_T) &
  get_date_diff(C_D, DOB, Age) &
  leq(Age,17).
`;

export const EPILOG_RULESET = definemorerules(
  [],
  readdata(EPILOG_RULESET_STRING),
);
