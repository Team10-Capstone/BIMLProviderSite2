import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../../../styles/retro.css'

export default function ProviderPage() {
  // Sample provider data
  const providerName = "Dr. Sarah Johnson";
  const providerSpecialty = "Physical Therapist";
  
  // Sample patient data with their exercises
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Michael Chen",
      age: 42,
      condition: "Lower back pain",
      lastVisit: "2023-11-12",
      nextVisit: "2023-11-26",
      progress: 65,
      exercises: [
        { id: 101, title: "Lower Back Stretch", frequency: "Daily", completed: 12, total: 14 },
        { id: 102, title: "Core Strengthening", frequency: "3x Weekly", completed: 7, total: 9 },
        { id: 103, title: "Posture Correction", frequency: "Daily", completed: 10, total: 14 }
      ]
    },
    {
      id: 2,
      name: "Jessica Rodriguez",
      age: 29,
      condition: "Knee rehabilitation",
      lastVisit: "2023-11-15",
      nextVisit: "2023-11-29",
      progress: 78,
      exercises: [
        { id: 201, title: "Knee Extensions", frequency: "Daily", completed: 13, total: 14 },
        { id: 202, title: "Resistance Band Training", frequency: "2x Weekly", completed: 5, total: 6 },
        { id: 203, title: "Balance Training", frequency: "3x Weekly", completed: 8, total: 9 }
      ]
    },
    {
      id: 3,
      name: "Robert Williams",
      age: 58,
      condition: "Shoulder impingement",
      lastVisit: "2023-11-18",
      nextVisit: "2023-12-02",
      progress: 42,
      exercises: [
        { id: 301, title: "Shoulder Mobility", frequency: "Daily", completed: 8, total: 14 },
        { id: 302, title: "Rotator Cuff Strengthening", frequency: "3x Weekly", completed: 4, total: 9 },
        { id: 303, title: "Posture Exercises", frequency: "Daily", completed: 6, total: 14 }
      ]
    },
    {
      id: 4,
      name: "Emily Foster",
      age: 35,
      condition: "Post-pregnancy core rehab",
      lastVisit: "2023-11-20",
      nextVisit: "2023-12-04",
      progress: 90,
      exercises: [
        { id: 401, title: "Pelvic Floor Exercises", frequency: "Daily", completed: 14, total: 14 },
        { id: 402, title: "Core Integration", frequency: "Daily", completed: 12, total: 14 },
        { id: 403, title: "Postural Alignment", frequency: "2x Weekly", completed: 6, total: 6 }
      ]
    }
  ]);

  // State to track which patient is expanded
  const [expandedPatient, setExpandedPatient] = useState(null);

  // Function to format date in a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Toggle patient expansion
  const togglePatient = (patientId) => {
    if (expandedPatient === patientId) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(patientId);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#111827',
        fontFamily: 'monospace',
        overflow: 'auto',
        padding: '20px'
      }}
    >
      {/* Background grid and glow */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-0 right-0 top-[-10%] h-[500px] bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 blur-[100px]" />
      </div>

      {/* Content Container */}
      <div style={{ 
        maxWidth: '1000px', 
        margin: '60px auto',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Provider Header - Buttons Removed */}
        <div style={{ 
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Provider Dashboard
            </h1>
            <p style={{ color: '#b8bfd0' }}>
              <span style={{ fontWeight: 'bold' }}>{providerName}</span> · {providerSpecialty}
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h3 style={{ color: '#b8bfd0', fontSize: '14px', marginBottom: '8px' }}>Total Patients</h3>
            <p style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>24</p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h3 style={{ color: '#b8bfd0', fontSize: '14px', marginBottom: '8px' }}>Active Programs</h3>
            <p style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>18</p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h3 style={{ color: '#b8bfd0', fontSize: '14px', marginBottom: '8px' }}>Compliance Rate</h3>
            <p style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>76%</p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h3 style={{ color: '#b8bfd0', fontSize: '14px', marginBottom: '8px' }}>Appointments</h3>
            <p style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>7</p>
            <span style={{ color: '#b8bfd0', fontSize: '14px' }}>Next 7 days</span>
          </div>
        </div>

        {/* Patients List */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: 'white'
            }}>
              Patients
            </h2>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '8px',
              padding: '8px 16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8bfd0" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                placeholder="Search patients..."
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  outline: 'none',
                  width: '200px'
                }}
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {patients.map(patient => (
              <div
                key={patient.id}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Patient header */}
                <div 
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={() => togglePatient(patient.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#b760ea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold', 
                        color: 'white',
                        marginBottom: '4px'
                      }}>
                        {patient.name}
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#b8bfd0'
                      }}>
                        {patient.age} years • {patient.condition}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#b8bfd0', textAlign: 'right', marginBottom: '4px' }}>
                        Next Visit
                      </p>
                      <p style={{ fontSize: '14px', color: 'white', fontWeight: 'bold' }}>
                        {formatDate(patient.nextVisit)}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '50%', 
                        position: 'relative',
                        background: `conic-gradient(#b760ea ${patient.progress}%, #2e3542 0)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{ 
                          width: '42px', 
                          height: '42px', 
                          borderRadius: '50%', 
                          backgroundColor: 'rgba(30, 41, 59, 0.95)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: 'white',
                          fontSize: '14px'
                        }}>
                          {patient.progress}%
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#b8bfd0' }}>Progress</span>
                    </div>
                    
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#b8bfd0" 
                      strokeWidth="2"
                      style={{
                        transform: expandedPatient === patient.id ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </div>
                </div>
                
                {/* Expanded content */}
                {expandedPatient === patient.id && (
                  <div style={{
                    padding: '0 20px 20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    marginTop: '10px'
                  }}>
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      color: 'white',
                      marginBottom: '16px',
                      paddingTop: '16px'
                    }}>
                      Exercise Program
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {patient.exercises.map(exercise => (
                        <div 
                          key={exercise.id}
                          style={{
                            backgroundColor: 'rgba(20, 30, 45, 0.5)',
                            padding: '16px',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <h5 style={{ 
                              fontSize: '16px', 
                              fontWeight: 'bold',
                              color: 'white',
                              marginBottom: '4px'
                            }}>
                              {exercise.title}
                            </h5>
                            <p style={{ fontSize: '14px', color: '#b8bfd0' }}>
                              {exercise.frequency}
                            </p>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div>
                              <p style={{ fontSize: '14px', color: '#10b981', textAlign: 'right' }}>
                                {exercise.completed}/{exercise.total} Completed
                              </p>
                              <div style={{
                                width: '120px',
                                height: '6px',
                                backgroundColor: '#2e3542',
                                borderRadius: '3px',
                                marginTop: '6px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  height: '100%',
                                  width: `${(exercise.completed / exercise.total) * 100}%`,
                                  backgroundColor: '#10b981',
                                  borderRadius: '3px'
                                }}></div>
                              </div>
                            </div>
                            
                            <button style={{
                              backgroundColor: 'rgba(183, 96, 234, 0.2)',
                              color: '#b760ea',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontSize: '13px',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}>
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end',
                      marginTop: '20px',
                      gap: '12px'
                    }}>
                      <button style={{
                        backgroundColor: 'rgba(30, 41, 59, 0.7)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}>
                        Patient History
                      </button>
                      
                      <button style={{
                        backgroundColor: '#b760ea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(183, 96, 234, 0.3)'
                      }}>
                        Edit Program
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation footer */}
        <div style={{ 
          marginTop: '40px', 
          display: 'flex', 
          justifyContent: 'center',
          gap: '20px'
        }}>
          <Link to="/exercises" style={{ 
            color: '#c490fd', 
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Exercises
          </Link>
          <Link to="/login" style={{ 
            color: '#c490fd', 
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Logout
          </Link>
        </div>
      </div>
    </div>
  )
}
