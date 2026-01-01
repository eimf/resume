import { Code2, Database, Palette, Server, Smartphone, Globe, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = [
    { name: 'Frontend Development', icon: Code2, color: 'bg-blue-50 text-blue-600' },
    { name: 'Backend Development', icon: Server, color: 'bg-green-50 text-green-600' },
    { name: 'Database Design', icon: Database, color: 'bg-orange-50 text-orange-600' },
    { name: 'UI/UX Design', icon: Palette, color: 'bg-pink-50 text-pink-600' },
    { name: 'Mobile Development', icon: Smartphone, color: 'bg-teal-50 text-teal-600' },
    { name: 'Web Architecture', icon: Globe, color: 'bg-cyan-50 text-cyan-600' },
  ];

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/Ezequiel-Lopez.pdf');
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Ezequiel-Lopez.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 200);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Fallback: open in new tab
      window.open('/Ezequiel-Lopez.pdf', '_blank');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden relative">
      {/* Parallax Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <div className="space-y-12">
          {/* Professional Summary */}
          <section
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-8 transition-transform duration-300"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Professional Summary</h2>
            <p className="text-slate-600 leading-relaxed">
              Results-driven software engineer with expertise in full-stack development and a proven track record
              of delivering scalable, high-performance applications. Specialized in modern web technologies with
              strong proficiency in system architecture, database optimization, and user-centered design. Committed
              to writing clean, maintainable code and continuously expanding technical knowledge to solve complex
              business challenges.
            </p>
          </section>

          {/* Skills Section */}
          <section
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-8 transition-transform duration-300"
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          >
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Core Competencies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.name}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1"
                    style={{ transform: `translateY(${scrollY * (0.01 + index * 0.002)}px)` }}
                  >
                    <div className={`p-3 rounded-lg ${skill.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-slate-700">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Download PDF Button */}
          <section
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-8 text-center transition-transform duration-300"
            style={{ transform: `translateY(${scrollY * 0.12}px)` }}
          >
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-wider text-slate-500 font-medium">Download Resume</p>
              <a
                href="/Ezequiel-Lopez.pdf"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all font-medium shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer no-underline"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
