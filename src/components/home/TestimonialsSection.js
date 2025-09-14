const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Vasavi Sindhu",
      role: "Cloud Engineer at Birllio",
      quote:
        "Being part of ITFT has been an amazing experience. I’ve learned so much from the workshops and made great friends along the way!",
      //image: "https://iili.io/KuuJu9e.jpg",
      image: "https://placehold.co/100x100?text=Vasavi",
    },
    {
      name: "Srinivasa Rao",
      role: "Software Engineer",
      quote:
        "The competitions organized by ITFT challenged me to push my limits and apply my knowledge in real-world scenarios.",
      image: "https://placehold.co/100x100?text=Srinu",
    },
    {
      name: "Sunil Gopi",
      role: "VAPT Analyst",
      quote:
        "I love the collaborative environment ITFT fosters. It’s a place where ideas are valued and innovation thrives.",
      image: "https://placehold.co/100x100?text=Sunil",
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="h3 fw-bold text-center mb-5">What Our Members Say</h2>
        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="rounded-circle mb-3"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />

                  <p className="text-muted fst-italic mb-3">"{testimonial.quote}"</p>
                  <h6 className="fw-bold mb-0">{testimonial.name}</h6>
                  <small className="text-muted">{testimonial.role}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
