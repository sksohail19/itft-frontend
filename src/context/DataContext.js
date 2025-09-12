import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [results, setResults] = useState([]);
    const [team, setTeam] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, resultsRes, teamRes, professorsRes, announcementsRes, studentsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/events/get/all', { headers: { "Content-Type": "application/json" } }),
                    axios.get('http://localhost:5000/api/results/get/all', { headers: { "Content-Type": "application/json" } }),
                    axios.get('http://localhost:5000/api/team/get/all', { headers: { "Content-Type": "application/json" } }),
                    axios.get('http://localhost:5000/api/professors/get/all', { headers: { "Content-Type": "application/json" } }),
                    axios.get('http://localhost:5000/api/announcements/get/all', { headers: { "Content-Type": "application/json" } }),
                    axios.get('http://localhost:5000/api/students/get/all', { headers: { "Content-Type": "application/json" } })
                ]);
                setEvents(eventsRes.data.events);
                setResults(resultsRes.data.results);
                setTeam(teamRes.data.teams);
                setProfessors(professorsRes.data.faculties);
                setAnnouncements(announcementsRes.data.announcements);
                setStudents(studentsRes.data.students);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    /* EVENTS CRUD OPERATIONS */
    // Add Event
    const addEvent = async (eventData) => {
        try {
            const title = eventData.title;
            const description = eventData.description;
            const date = eventData.date;
            const location = eventData.location;
            const registrationLink = eventData.registrationLink;
            const poster = eventData.imageUrl;
            const type = eventData.type;
            const status = eventData.status;
            //console.log(localStorage.getItem("authToken"));
            const res = await axios.post("http://localhost:5000/api/events/create", {
                title, description, date, location, registrationLink, poster, type, status
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                },
            });

            if (res.status === 200) {
                console.log("Events: ", events);
                const newEvent = res.data.event;
                setEvents((prevEvents) => [newEvent, ...prevEvents]);
                return newEvent;
            } else {
                throw new Error("Failed to add event");
            }
        } catch (err) {
            console.error("Error adding event:", err);
            throw err;
        }
    };

    // Update Event
    const updateEvent = async (eventData) => {
        const title = eventData.title;
        const description = eventData.description;
        const date = eventData.date;
        const location = eventData.location;
        const registrationLink = eventData.registrationLink;
        const poster = eventData.imageUrl;
        const type = eventData.type;
        const status = eventData.status;
        try {
            const res = await axios.put(
                `http://localhost:5000/api/events/update/${eventData._id}`,
                { title, description, date, location, registrationLink, poster, type, status },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authToken": `${localStorage.getItem("authToken")}`,
                    },
                }
            );

            const savedEvent = res.data.event || res.data;

            setEvents((prev) =>
                prev.map((e) => (e.id === savedEvent.id ? savedEvent : e))
            );

            return savedEvent;
        } catch (err) {
            console.error("Error updating event:", err);
            throw err;
        }
    };

    // Delete Event - Fixed function name
    const deleteEvent = async (eventId) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/events/${eventId}`,
                {
                    headers: {
                        "authToken": `${localStorage.getItem("authToken")}`,
                    },
                }
            );

            setEvents((prev) => prev.filter((e) => e.id !== eventId));
        } catch (err) {
            console.error("Error deleting event:", err);
            throw err;
        }
    };

    const deleteEventByID = async (eventId) => {
        try {
            const res = await axios.delete(
                `http://localhost:5000/api/events/delete/${eventId}`,
                {
                    headers: {
                        "authToken": `${localStorage.getItem("authToken")}`,
                    },
                }
            );
            if (res.status === 200)
                setEvents((prev) => prev.filter((e) => e._id !== eventId));
        } catch (err) {
            console.error("Error deleting event:", err);
            throw err;
        }
    };

    const deteleEvent = async (id) => {
        try {
            const res = await axios.delete("http://localhost:5000/api/events/delete/all", {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });

            if (res.status === 200) {
                setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
                return true;
            }
        } catch (errors) {
            console.error("Error deleting event by ID:", errors);
            throw errors;
        }
    }

    const getEventByID = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/events/get/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });

            if (res.status === 200) {
                return res.data.event;
            } else {
                throw new Error("Failed to get event by ID");
            }
        } catch (errors) {
            console.error("Error getting event by ID:", errors);
            throw errors;
        }
    }

    /* RESULTS CRUD OPERATIONS */
    const addResult = async (result) => {
        const eventID = result.eventID;
        const eventName = result.eventName;
        const winner = result.winner;
        const runnerUp = result.runnerUp;
        const date = result.date;
        const noOfParticipants = result.noOfParticipants;
        const video = result.video;
        const venue = result.venue;
        const resultSheet = result.resultSheet;
        const eventsImages = result.eventsImages;
        try {
            const res = await axios.post(
                "http://localhost:5000/api/results/create",
                {
                    eventID,
                    eventName,
                    winner,
                    runnerUp,
                    date,
                    noOfParticipants,
                    video,
                    venue,
                    resultSheet,
                    eventsImages
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authToken: localStorage.getItem("authToken"),
                    },
                }
            );
            console.log("Added Successfully ", res.data.result)
            if (res.status === 200) {
                const newResult = res.data.result;
                setResults((prevResults) => [newResult, ...prevResults]);
                return newResult;
            } else {
                throw new Error("Failed to add result");
            }
        } catch (errors) {
            console.error("Error adding result:", errors);
            throw errors;
        }
    }

    const editResult = async (id, result) => {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/results/update/${id}`,
                {
                    eventID: result.eventID,
                    eventName: result.eventName,
                    winner: result.winner,
                    runnerUp: result.runnerUp,
                    date: result.date,
                    noOfParticipants: result.noOfParticipants,
                    video: result.video,
                    venue: result.venue,
                    eventsImages: result.eventsImages,
                    resultSheet: result.resultSheet
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authToken": localStorage.getItem("authToken"),
                    },
                }
            );
            if (res.status === 200) {
                const updatedResult = res.data.result;
                setResults((prevResults) =>
                    prevResults.map((result) => (result._id === id ? updatedResult : result))
                );
                return updatedResult;
            } else {
                throw new Error("Failed to edit result");
            }
        } catch (errors) {
            console.error("Error editing result:", errors);
            throw errors;
        }
    }

    // Add missing updateResult function
    const updateResult = async (id, updatedData) => {
        return editResult(id, updatedData);
    }

    // Add missing deleteResult function  
    const deleteResult = async (id) => {
        return deleteResultByID(id);
    }

    const deleteResults = async () => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/results/delete/all`, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });
            if (res.status === 200) {
                setResults([]);
                return true;
            } else {
                throw new Error("Failed to delete result");
            }
        } catch (errors) {
            console.error("Error deleting result:", errors);
            throw errors;
        }
    }

    const deleteResultByID = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/results/delete/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });
            if (res.status === 200) {
                setResults((prevResults) => prevResults.filter((result) => result._id !== id));
                return true;
            } else {
                throw new Error("Failed to delete result by ID");
            }
        } catch (errors) {
            console.error("Error deleting result by ID:", errors);
            throw errors;
        }
    }

    const getResultByID = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/results/get/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 200) {
                return res.data.result;
            } else {
                throw new Error("Failed to get result by ID");
            }
        } catch (errors) {
            console.error("Error getting result by ID:", errors);
            throw errors;
        }
    }

    /* TEAM CRUD OPERATIONS */
    const addTeamMember = async (memberData) => {
        console.log("Starting Operation")
        try {
            const res = await axios.post(
                "http://localhost:5000/api/team/add",
                {
                    name: memberData.name,
                    rollNumber: memberData.rollNumber,
                    role: memberData.role,
                    image: memberData.imageUrl,   // ✅ use consistent key
                    email: memberData.email,
                    linkedin: memberData.linkedin,
                    gitHub: memberData.github,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authToken": localStorage.getItem("authToken"),
                    },
                }
            );

            console.log("Add Team Member Response:", res);

            if (res.status === 200) {
                if (res.data.user) {
                    // backend returned a single new member
                    const newMember = {
                        ...res.data.user,
                        imageUrl: res.data.user.image || res.data.member.imageUrl,
                        github: res.data.user.gitHub,
                        linkedin: res.data.user.linkedin
                    };
                    setTeam((prevTeam = []) => [newMember, ...prevTeam]); // ✅ fallback to []
                    return newMember;
                }
                /*
                if (res.data.team) {
                    // backend returned the full team
                    const updatedTeam = res.data.team.map((m) => ({
                        ...m,
                        imageUrl: m.image || m.imageUrl,
                    }));
                    setTeam(updatedTeam);
                    return updatedTeam;
                }
*/
                throw new Error("Unexpected response format from backend");
            } else {
                throw new Error("Failed to add team member");
            }
        } catch (errors) {
            console.error("Error adding team member:", errors);
            throw errors;
        }
    };


    const editTeamMember = async (id, updatedData) => {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/team/update/${id}`,
                {
                    name: updatedData.name,
                    rollNumber: updatedData.rollNumber,
                    role: updatedData.role,
                    image: updatedData.imageUrl,   // ✅ use consistent key
                    email: updatedData.email,
                    linkedin: updatedData.linkedin,
                    gitHub: updatedData.github,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authToken": localStorage.getItem("authToken"),
                    },
                });
            if (res.status === 200) {
                const updatedMember = res.data.member;
                setTeam((prevTeam) =>
                    prevTeam.map((member) => (member._id === id ? updatedMember : member))
                );
                return updatedMember;
            } else {
                throw new Error("Failed to edit team member");
            }
        } catch (errors) {
            console.error("Error editing team member:", errors);
            throw errors;
        }
    }

    // Add missing updateTeamMember function
    const updateTeamMember = async (currentId, updatedMember) => {
        //const { name, rollNumber, role, image, email, linkedin, gitHub, portfolio } = updatedMember;
        try {
            const res = await axios.put(
                `http://localhost:5000/api/team/update/${currentId}`,
               {
                    name: updatedMember.name,
                    rollNumber: updatedMember.rollNumber,
                    role: updatedMember.role,
                    image: updatedMember.imageUrl,   // ✅ use consistent key
                    email: updatedMember.email,
                    linkedin: updatedMember.linkedin,
                    gitHub: updatedMember.github,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authToken": localStorage.getItem("authToken"),
                    },
                }
            );
            if (res.status === 200) {
                const savedMember = res.data.user;
                setTeam((prevTeam) =>
                    prevTeam.map((member) => (member.id === savedMember.id ? savedMember : member))
                );
                return savedMember;
            } else {
                throw new Error("Failed to update team member");
            }
        } catch (errors) {
            console.error("Error updating team member:", errors);
            throw errors;
        }
    }

    const deleteTeamMember = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/team/delete/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });
            if (res.status === 200) {
                setTeam((prevTeam) => prevTeam.filter((user) => user._id !== id && user.id !== id));
                return true;
            } else {
                throw new Error("Failed to delete team member");
            }
        } catch (errors) {
            console.error("Error deleting team member:", errors);
            throw errors;
        }
    }

    const deleteTeamMembers = async () => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/team/delete/all`, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });
            if (res.status === 200) {
                setTeam([]);
                return true;
            } else {
                throw new Error("Failed to delete team member");
            }
        } catch (errors) {
            console.error("Error deleting team member:", errors);
            throw errors;
        }
    }

    const getTeamMemberByID = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/team/get/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 200) {
                return res.data.member;
            } else {
                throw new Error("Failed to get team member by ID");
            }
        } catch (errors) {
            console.error("Error getting team member by ID:", errors);
            throw errors;
        }
    }

    /* PROFESSORS CRUD OPERATIONS */
    const addProfessor = async (professorData) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/professors/add",
                {
                    name: professorData.name,
                    designation: professorData.designation,
                    department: professorData.department,
                    image: professorData.image,
                    experience: professorData.experience,
                    email: professorData.email,
                    linkedIn: professorData.linkedIn,
                    googleScholar: professorData.googleScholar,
                    message: professorData.message
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authToken": localStorage.getItem("authToken"),
                    },
                }
            );
            if (res.status === 200) {
                const newProfessor = res.data.professor;
                setProfessors((prevProfessors) => [newProfessor, ...prevProfessors]);
                return newProfessor;
            } else {
                throw new Error("Failed to add professor");
            }
        }
        catch (error) {
            console.error("Error adding professor:", error);
            throw error;
        }
    }

    const editProfessor = async (id, professorData) => {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/professors/update/${id}`,
                {
                    name: professorData.name,
                    designation: professorData.designation,
                    department: professorData.department,
                    image: professorData.image,
                    experience: professorData.experience,
                    email: professorData.email,
                    linkedIn: professorData.linkedIn,
                    googleScholar: professorData.googleScholar,
                    message: professorData.message
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authToken": localStorage.getItem("authToken"),
                    },
                }
            );
            if (res.status === 200) {
                const updatedProfessor = res.data.professor;
                setProfessors((prevProfessors) =>
                    prevProfessors.map((professor) => (professor._id === id ? updatedProfessor : professor))
                );
                return updatedProfessor;
            } else {
                throw new Error("Failed to edit professor");
            }
        } catch (error) {
            console.error("Error editing professor:", error);
            throw error;
        }
    }

    // Add missing updateProfessor function
    const updateProfessor = async (id, updatedData) => {
        return editProfessor(id, updatedData);
    }

    const deleteProfessor = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/professors/delete/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });
            if (res.status === 200) {
                setProfessors((prevProfessors) => prevProfessors.filter((professor) => professor._id !== id));
                return true;
            } else {
                throw new Error("Failed to delete professor");
            }
        } catch (error) {
            console.error("Error deleting professor:", error);
            throw error;
        }
    }

    const deleteProfessors = async () => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/professors/delete/all`, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });
            if (res.status === 200) {
                setProfessors([]);
                return true;
            }
            else {
                throw new Error("Failed to delete professors");
            }
        } catch (error) {
            console.error("Error deleting professors:", error);
            throw error;
        }
    }

    const getProfessorByID = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/professors/get/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 200) {
                return res.data.professor;
            } else {
                throw new Error("Failed to get professor by ID");
            }
        } catch (error) {
            console.error("Error getting professor by ID:", error);
            throw error;
        }
    }

    /* STUDENTS CRUD OPERATIONS */
    const addStudent = async (studentsData) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/students/add",
                {
                    regno : studentsData.regno,
                    name : studentsData.name,
                    studentEmail : studentsData.studentEmail,
                    year : studentsData.year,
                    section : studentsData.section,
                    image : studentsData.image,
                    linkedin : studentsData.linkedin,
                    github : studentsData.github,
                    personalEmail : studentsData.personalEmail,
                    portfolio : studentsData.portfolio
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Added Successfully: ", res);
            if (res.status === 200) {
                const newStudent = res.data.Student;
                setStudents((prevStudents) => [newStudent, ...prevStudents]);
                return newStudent;
            } else {
                throw new Error("Failed to add student");
            }
        } catch (errors) {
            console.error("Error adding student:", errors);
            throw errors;
        }
    }

    const editStudent = async (id, studentsData) => {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/students/update/${id}`,
                {
                    regno : studentsData.regno,
                    name : studentsData.name,
                    studentEmail : studentsData.studentEmail,
                    year : studentsData.year,
                    section : studentsData.section,
                    image : studentsData.image,
                    linkedin : studentsData.linkedin,
                    github : studentsData.github,
                    personalEmail : studentsData.personalEmail,
                    portfolio : studentsData.portfolio
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authToken": localStorage.getItem("authToken"),
                    },
                }
            );
            if (res.status === 200) {
                const updatedStudent = res.data.user;
                setStudents((prevStudents) =>
                    prevStudents.map((student) => (student._id === id ? updatedStudent : student))
                );
                return updatedStudent;
            } else {
                throw new Error("Failed to edit student");
            }
        } catch (errors) {
            console.error("Error editing student:", errors);
            throw errors;
        }
    }

    const deleteStudent = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/students/delete/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });
            if (res.status === 200) {
                setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
                return true;
            } else {
                throw new Error("Failed to delete student");
            }
        } catch (errors) {
            console.error("Error deleting student:", errors);
            throw errors;
        }
    }

    const deleteStudents = async () => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/students/delete/all`, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });
            if (res.status === 200) {
                setStudents([]);
                return true;
            } else {
                throw new Error("Failed to delete students");
            }
        } catch (errors) {
            console.error("Error deleting students:", errors);
            throw errors;
        }
    }

    const getStudentByID = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/students/get/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 200) {
                return res.data.student;
            } else {
                throw new Error("Failed to get student by ID");
            }
        } catch (errors) {
            console.error("Error getting student by ID:", errors);
            throw errors;
        }
    }

    /* ANNOUNCEMENTS CRUD OPERATIONS - MISSING FUNCTIONS ADDED */
    const addAnnouncement = async (announcementData) => {
        const { title, description, date, isActive } = announcementData;
        console.log(announcementData);
        try {
            const res = await axios.post(
                "http://localhost:5000/api/announcements/create",
                { title, description, date, isActive },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authToken: localStorage.getItem("authToken"),
                    },
                }
            );
            if (res.status === 200 || res.status === 201) {
                const created = res.data;

                // ensure the new announcement has an _id and other required fields
                const safeCreated = {
                    _id: created._id || Date.now().toString(), // fallback id if backend didn’t return one
                    title: created.title ?? title,
                    description: created.description ?? description,
                    date: created.date ?? date,
                    isActive: created.isActive ?? isActive,
                };

                setAnnouncements((prev) => [
                    ...prev.filter(Boolean), // keep only valid announcements
                    safeCreated,             // add the new announcement
                ]);

                return safeCreated;
            }
            else {
                throw new Error("Failed to add announcement");
            }
        } catch (errors) {
            console.error("Error adding announcement:", errors);
            throw errors;
        }
    }

    const editAnnouncement = async (id, updatedData) => {
        const { title, description, date, isActive } = updatedData;
        try {
            const res = await axios.put(
                `http://localhost:5000/api/announcements/update/${id}`,
                { title, description, date, isActive },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "authToken": localStorage.getItem("authToken"),
                    },
                }
            );
            if (res.status >= 200 && res.status < 300) {
                // Adjust depending on how your backend sends the response
                setAnnouncements((prev) =>
                    prev
                        .filter(Boolean) // remove null/undefined
                        .map((a) => (a._id === id ? { ...a, ...updatedData } : a))
                );


                //return updatedAnnouncement;
            } else {
                throw new Error("Failed to edit announcement");
            }

        } catch (errors) {
            console.error("Error editing announcement:", errors);
            throw errors;
        }
    }

    const deleteAnnouncement = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:5000/api/announcements/delete/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "authToken": localStorage.getItem("authToken"),
                }
            });
            if (res.status === 200) {
                setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== id));
                return true;
            } else {
                throw new Error("Failed to delete announcement");
            }
        } catch (errors) {
            console.error("Error deleting announcement:", errors);
            throw errors;
        }
    }

    return (
        <DataContext.Provider value={{
            events, results, team, professors, announcements, students,
            loading,
            // Events
            addEvent, updateEvent, deleteEvent, deleteEventByID, getEventByID, deteleEvent,
            // Results  
            addResult, editResult, updateResult, deleteResult, deleteResults, getResultByID, deleteResultByID,
            // Team
            addTeamMember, editTeamMember, updateTeamMember, deleteTeamMember, getTeamMemberByID, deleteTeamMembers,
            // Professors
            addProfessor, editProfessor, updateProfessor, deleteProfessor, getProfessorByID, deleteProfessors,
            // Students
            addStudent, editStudent, deleteStudent, getStudentByID, deleteStudents,
            // Announcements
            addAnnouncement, editAnnouncement, deleteAnnouncement
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}

export default DataProvider;