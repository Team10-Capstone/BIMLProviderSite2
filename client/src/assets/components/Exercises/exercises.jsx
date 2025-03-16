import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../../../styles/retro.css'

export default function ExercisesPage() {
  // Sample exercise data (in a real app, this would come from an API)
  const [exercises, setExercises] = useState([
    { 
      id: 1, 
      title: 'Push Workout', 
      date: '2023-11-15', 
      description: 'Chest, shoulders, and triceps workout',
      completed: true
    },
    { 
      id: 2, 
      title: 'Pull Workout', 
      date: '2023-11-17', 
      description: 'Back and biceps workout',
      completed: true
    },
    { 
      id: 3, 
      title: 'Leg Day', 
      date: '2023-11-19', 
      description: 'Quadriceps, hamstrings, and calves',
      completed: false
    },
    { 
      id: 4, 
      title: 'HIIT Session', 
      date: '2023-11-22', 
      description: 'High intensity interval training',
      completed: false
    }
  ]);

  // Function to format date in a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
        maxWidth: '800px', 
        margin: '60px auto',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              My Exercises
            </h1>
            <p style={{ color: '#b8bfd0' }}>Track your fitness journey</p>
          </div>
          
          <button 
            style={{
              backgroundColor: '#b760ea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(183, 96, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Add Exercise
          </button>
        </div>

        {/* Exercise List */}
        <div style={{ 
          display: 'grid', 
          gap: '16px'
        }}>
          {exercises.map(exercise => (
            <div
              key={exercise.id}
              style={{
                backgroundColor: 'rgba(30, 36, 50, 0.7)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '20px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => console.log(`Viewing exercise ${exercise.id}`)}
            >
              {/* Status indicator */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '4px',
                height: '100%',
                backgroundColor: exercise.completed ? '#10b981' : '#b760ea'
              }}></div>
              
              <div style={{ marginLeft: '8px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h2 style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '6px'
                  }}>
                    {exercise.title}
                  </h2>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#9ca3af',
                    fontWeight: 'bold'
                  }}>
                    {formatDate(exercise.date)}
                  </span>
                </div>
                
                <p style={{ 
                  color: '#d1d5db',
                  marginBottom: '8px',
                  fontSize: '15px'
                }}>
                  {exercise.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px'
                }}>
                  <span style={{ 
                    fontSize: '14px',
                    color: exercise.completed ? '#10b981' : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {exercise.completed ? (
                        <path d="M20 6L9 17l-5-5" />
                      ) : (
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    {exercise.completed ? 'Completed' : 'Scheduled'}
                  </span>
                  
                  <button style={{
                    backgroundColor: 'transparent',
                    color: '#d1d5db',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation footer */}
        <div style={{ 
          marginTop: '40px', 
          display: 'flex', 
          justifyContent: 'center',
          gap: '20px'
        }}>
          <Link to="/dashboard" style={{ 
            color: '#c490fd', 
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
            Dashboard
          </Link>
          <Link to="/profile" style={{ 
            color: '#c490fd', 
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
            Profile
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
