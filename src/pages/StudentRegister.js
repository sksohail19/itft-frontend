import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import axios from "axios";

export default function StudentRegister() {
    const navigate = useNavigate();
    const { addStudent } = useData();

    const [formData, setFormData] = useState({
        regno: "",
        name: "",
        year: "",
        section: "A",
        studentEmail: "",
        image: "",
        linkedin: "",
        github: "",
        personalEmail: "",
        portfolio: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post("http://localhost:5000/api/students/add", {
                regno: formData.regno,
                name: formData.name,
                studentEmail: formData.studentEmail,
                year: formData.year,
                section: formData.section,
                image: formData.image,
                linkedin: formData.linkedin,
                github: formData.github,
                personalEmail: formData.personalEmail,
                portfolio: formData.portfolio
            });
            //const res = await addStudent(formData);
            if (res.status === 201) {
                setMessage("Thank you! Student registered successfully.");
                setTimeout(() => {
                    navigate("/"); // redirect after success
                }, 1500);
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Student Registration</h2>

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Reg No</label>
                    <input type="text" className="form-control" name="regno" value={formData.regno} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Year</label>
                    <input type="text" className="form-control" name="year" value={formData.year} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Section</label>
                    <select className="form-select" name="section" value={formData.section} onChange={handleChange} required>
                        {["A", "B", "C", "D", "E", "F", "G", "H"].map(sec => (
                            <option key={sec} value={sec}>{sec}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Student Email</label>
                    <input type="email" className="form-control" name="studentEmail" value={formData.studentEmail} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Profile Image URL</label>
                    <input type="text" className="form-control" name="image" value={formData.image} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">LinkedIn</label>
                    <input type="text" className="form-control" name="linkedin" value={formData.linkedin} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">GitHub</label>
                    <input type="text" className="form-control" name="github" value={formData.github} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Personal Email</label>
                    <input type="email" className="form-control" name="personalEmail" value={formData.personalEmail} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Portfolio (optional)</label>
                    <input type="text" className="form-control" name="portfolio" value={formData.portfolio} onChange={handleChange} />
                </div>



                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}
