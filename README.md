setup a working backend for this project to register users and store data


- User 
    - username
    - user ID
    - Name
    - Email 
    - Password
    - role (Admin, User, Teacher)

- Student table 
    - User ID
    - Student ID
    - 
- Sessions (the class)
    - Course ID
    - Teacher ID
    - Sessions ID
    - Time 
    - Date 
    - Venue
- Course 
    - Course ID
    - Course name
- Teacher 
    - User ID
    - Teacher ID
    - Department
    - 
- Admin 
    - User ID
    - Admin ID
- Attendance 
    - Attendance ID
    - Student ID and time logged in
    - Teacher ID
    - Session ID
- QR code
    - time reset after 10 minutes

####  test code
    import { useUserStore } from "@/lib/store/user";
import { supabaseClient } from "@/lib/supabase/client";
import { supabaseServer } from "@/lib/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = supabaseClient();

  // const { data, error } = await supabase.auth.getUser();
  // if (!error || data?.user) {
  //   redirect("/class");
  // }

 const { data, error } = await supabase.from("profiles").select("*");

if (error) {
  console.error("Supabase error:", error.message);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.5rem",
        color: "red",
      }}
    > 
      <h2>{error.message}</h2>
    </div>
  );
}

return (
  <div>
    ✅ Connected to Supabase!
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);

  return (
    <main className=" ">
      {/* <section className="bg-slate-200 rounded-3xl w-full  h-full flex justify-center items-center"> */}
      <section className="mx-auto max-w-2xl flex flex-col items-center min-h-screen h-dvh justify-center p-4 space-y-6">
        <h2 className="flex flex-col items-center text-5xl font-bold">
          <span>Welcome to</span>
          <span>Time Trace</span>
        </h2>
        <p className="max-w-3xl text-center">
          TImeTrace is a web application designed to simplify attendance
          tracking for educational institutions. Using our platform, instructors
          can easily create classes and generate unique QR codes for students to
          scan, making the attendance process efficient, accurate, and
          hassle-free.
        </p>
        <div className="flex flex-col items-start p-4 bg-blue-950 text-white max-w-2xl rounded-2xl">
          <p className="text-xl font-medium text-yellow-600">Key Features</p>
          <p>
            Easy class creation and management, Automatic QR code generation,
            Real-time attendance tracking , Comprehensive attendance reports
          </p>
        </div>
      </section>
      {/* </section> */}
    </main>
  );
}



#### db schema
-- ========================
-- ENUMS
-- ========================

-- user roles
create type user_role as enum ('admin', 'teacher', 'student');

-- attendance status
create type attendance_status as enum ('present', 'late', 'absent');

-- ========================
-- PROFILES (extends auth.users)
-- ========================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  name text,
  email text unique,
  role user_role not null default 'student',
  student_id text unique,
  teacher_id text unique,
  admin_id text unique,
  department text
);

-- ========================
-- COURSES
-- ========================

create table courses (
  id uuid primary key default gen_random_uuid(),
  course_code text unique not null,
  course_name text not null
);

-- ========================
-- SESSIONS (Class Sessions)
-- ========================

create table sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  teacher_id uuid references profiles(id) on delete set null,
  session_date date not null,
  session_time time not null,
  venue text,
  qr_code text,
  qr_expiry timestamp
);

-- ========================
-- ATTENDANCE
-- ========================

create table attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  teacher_id uuid references profiles(id) on delete set null,
  time_logged timestamp default now(),
  status attendance_status not null default 'present'
);

-- ========================
-- INDEXES (for performance)
-- ========================

create index idx_profiles_role on profiles(role);
create index idx_courses_code on courses(course_code);
create index idx_sessions_course on sessions(course_id);
create index idx_attendance_session on attendance(session_id);
create index idx_attendance_student on attendance(student_id);

#### doc

Schema
profiles → user info & roles
courses → course info
sessions → class sessions with QR codes
attendance → student attendance per session
user_role enum → 'admin' | 'teacher' | 'student'
attendance_status enum → 'present' | 'late' | 'absent'
Utils / Files
supabaseClient.ts – initializes Supabase client
types.ts – defines UserRole, AttendanceStatus, Profile, Course, Session, Attendance
auth.ts – sign up, login, logout, get current user, matches profiles table
courses.ts – CRUD for courses, matches courses table
profiles.ts – CRUD for profiles, matches profiles table
sessions.ts – CRUD for sessions, matches sessions table
attendance.ts – CRUD for attendance + update status, matches attendance table
qr.ts – generate & validate QR codes for sessions
db.ts – generic helper for any table: insert, get, update, delete


#### next steps 
1. Decide the pages / flows you want to implement
Since we’re focusing on functionality first (not UI), identify the core pages you need for MVP:
app/page.tsx → Home / landing screen with links to login/signup
create-account/page.tsx → Sign up form for users (students, teachers, admin)
login/page.tsx → Login form
dashboard/page.tsx (optional for later) → Role-based dashboard
sessions/page.tsx → List or create sessions (teacher/admin)
attendance/page.tsx → Mark attendance or view records
2. Map each page to the corresponding utils
For example:
Page	Utils / Functions Needed
create-account/page.tsx	auth.signUp, profiles.createProfile
login/page.tsx	auth.login, auth.getCurrentUser
dashboard/page.tsx	profiles.getProfileById, sessions.getSessionsByTeacher, attendance.getAttendanceByStudent
sessions/page.tsx	sessions.createSession, sessions.getSessionsByCourse, qr.generateQrCode
attendance/page.tsx	attendance.markAttendance, attendance.getAttendanceBySession
3. Decide state / flow
Forms → call auth or profiles utils
Display data → call db, courses, sessions, attendance utils
Error handling → capture { error, data } from utils and show messages
QR → generate & validate QR codes when teacher/admin interacts
4. Environment setup
Ensure .env.local is ready with:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
Supabase project matches the schema
5. Plan the first page to implement
I suggest starting with create-account/page.tsx because signing up is foundational.
Once it works, you can easily move to login, dashboards, and session/attendance flows.



## For Andy
- style it
- after styling it, we need to do th dashboard role base
    - meaning that the user should see only what they can see
- then we look at the attendance remotely after scanning
- then we look at hosting 
- then testing 