\version "2.20.0"
\header {
  title = "Maker Fire Clockwork Child"
  composer = "John Asmuth"
  tagline = ""
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)

fullcyclerest = { 
  r1 | r1 | r1 | r1 |
  r1 | r1 | r1 | r1 |
  r1 | r1 |
}
fullcyclespace = { 
  s1 | s1 | s1 | s1 |
  s1 | s1 | s1 | s1 |
  s1 | s1 |
}

<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Child"
    shortInstrumentName = #"Ch."
  } {
    \tempo 4 = 140
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \key a \major
        
        %1
        \fullcyclerest
        \break \bar "||"
   
        %2
        \fullcyclerest
        \break \bar "||"
        
        %3
        \fullcyclerest
        \break \bar "||"
        
        %4
        \fullcyclerest
        \break \bar "||"
  
        %5
        r1 | r1 |
        c'''4. b''8 ais''4 b'' | ais''1 |
        c'''4. b''8 ais''4 b'' | ais''2 gis'' |
        c'''4. b''8 ais''4 b'' | ais''1 |
        c'''4. b''8 ais''4 b'' | ais''8 b'' ais'' b'' ais''8 b'' ais'' b'' |
        \break \bar "||"
  
        %6
        c'''4. b''8 ais''4 b'' | ais''2 gis'' |
        c'''4. b''8 ais''4 b'' | ais''1 |
        c'''4. b''8 ais''4 b'' | ais''2 gis'' |
        c'''4. b''8 ais''4 b'' | ais''1 |
        c'''4. b''8 ais''4 b'' | ais''8 b'' ais'' b'' ais''8 b'' ais'' b'' |
        \break \bar "||"
  
        %tumble
        ais''8 b'' ais'' b'' ais''8 b'' ais'' b''| 
        r1 | r1 |
        \break \bar "||"
        
        
        
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        %1
        \fullcyclespace
        
        %2
        \fullcyclespace
        
        %3
        \fullcyclespace
        
        %4
        \fullcyclespace
        
        %5
        \fullcyclespace
        
        %6
        \fullcyclespace
        
        %tumble
        s1 s1 s1 |
        
      }
    >>
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Clockwork"
    shortInstrumentName = #"Cl."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \key f \minor
        
        %1
        \fullcyclerest
        
        %2
        \fullcyclerest
        
        %3
        \repeat percent 3 {
          bes'4 r8 bes'4 r8 bes'4 | r8 bes'4 r8 bes'4 r8 bes'8~ | bes'8 r8 bes'4 r8 bes'4 r8 |
        }
        bes'8\< bes' bes' bes' bes' bes' bes' bes'\! | 
        
        %4 5 6
        \repeat unfold 3 {
          \repeat percent 5 {
            bes'8[ aes' g'] bes'[ aes' g'] bes'[ aes' |
            g'8] bes'[ aes' g'] bes'[ aes' g' aes'] |
          }
        }
  
        %tumble
        g'8 aes' g' aes' g' aes' g' aes' |
        r1 | r1 |
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        %1
        \fullcyclespace
        
        %2
        \fullcyclespace
        
        %3
        \fullcyclespace
        
        %4
        \fullcyclespace
        
        %5
        \fullcyclespace
        
        %6
        \fullcyclespace
        
        %tumble
        s1 s1 s1 |
        
      }
    >>
    
  }
  
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Fire"
    shortInstrumentName = #"F."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \key ees \minor
        
        %1
        \fullcyclerest
        
        %2
        \repeat percent 10 {
          bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r |
        }
         
        %3
        \repeat percent 3 {
          \repeat unfold 3 {
            bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r |
          }
        }
        bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r |
        
        %4 5 6
        \repeat unfold 3 {
          \repeat unfold 2 {
           <bes' ees''>8\staccato r4 <bes' ees''>8\staccato r4 <bes' ees''>8\staccato r |
          }
          \repeat unfold 2 {
            <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r |
          }
          \repeat unfold 2 {
            <bes' des''>8\staccato r4 <bes' des''>8\staccato r4 <bes' des''>8\staccato r |
          }
          \repeat unfold 2 {
            <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r4 <bes' ces''>8\staccato r |
          }
          <bes' des''>8\staccato r4 <bes' des''>8\staccato r4 <bes' des''>8\staccato r |
          <bes' des''>8\staccato r4 <bes' des''>8\staccato r4 <bes' des'' e''>4-> |
        }
        
        %tumble
        ces''8 des'' ces'' des'' ces''8 des'' ces'' des'' | 
        r1 | r1 |
        
      }
    >>
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Maker"
    shortInstrumentName = #"M."
  } {
    \set Staff.connectArpeggios = ##t
    % \partial 4
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \key cis \minor
        
        %1
        <e-0>8-"open string, detuning, retuning" e e e e e e e |
        \repeat tremolo 8 {e8_"sim."} |
        \repeat tremolo 8 {<dis-0>8} | \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<e-0>8} | \repeat tremolo 8 {e} |
        \repeat tremolo 8 {<dis-0>}| \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<cis-0>8} | \repeat tremolo 8 {<dis-0>} |
        
        %2
        \repeat tremolo 8 {<e>8} |
        \repeat tremolo 8 {e8} |
        \repeat tremolo 8 {<dis>8} | \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
        \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<cis-0>8-\markup{ "leave" \circle 6 "on C#"}} | \repeat tremolo 8 {<dis-2>} |
        
        %3
        \repeat tremolo 8 {<e-3>8} |
        \repeat tremolo 8 {e8} |
        \repeat tremolo 8 {<dis-2>8} | \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
        \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<cis>8} | \repeat tremolo 8 {<dis>} |
        
        %4
        \repeat tremolo 8 {<e>8} |
        \repeat tremolo 8 {e8} |
        \repeat tremolo 8 {<dis>8} | \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
        \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<cis>8} | \repeat tremolo 8 {<dis>} |
        
        %5
        \repeat tremolo 8 {<e>8} |
        \repeat tremolo 8 {e8} |
        \repeat tremolo 8 {<dis>8} | \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
        \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<cis>8} | \repeat tremolo 8 {<dis>} |
  
        %6
        \repeat tremolo 8 {<e>8} |
        \repeat tremolo 8 {e8} |
        \repeat tremolo 8 {<dis>8} | \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<e>8} | \repeat tremolo 8 {e} |
        \repeat tremolo 8 {<dis>}| \repeat tremolo 8 {dis} |
        \repeat tremolo 8 {<e-0>8_\markup{"back up to" \circle 6 "=E"}} | \repeat tremolo 8 {<e>} |
        
        %tumble
        e4_\markup {"pizz. B." \draw-dashed-line #'(75 . 0) }\staccato e\staccato e\staccato e\staccato |
        e16(f e8\staccato) r2. | r1 |
        
      }
    >>
  }

>>

% interlude

<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Child"
    shortInstrumentName = #"Ch."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
                
        %interlude
        %1
        r1 | r1 | r1 |
        r1 | r1 | r2.. e'''16 e''' |
        \break \bar "||"
        
        e'''4~ e'''8 d'''8\staccato r2 | r1 | r1 |
        r1 | r1 | r2.. e'''16 e''' |
        \break \bar "||"
        
        e'''4~ e'''8 d'''8\staccato r2 | r1 | r1 |
        r1 | r1 | r2.. e'''16 e''' |
        \break \bar "||"
        
        e'''4~ e'''8 d'''8\staccato r2 | r1 | r1 |
        r1 | r1 | r2.. e'''16 e''' |
        \break \bar "||"
        
        e'''4~ e'''8 d'''8\staccato r2 | r1 | r1 |
        r1 | r1 | r1 |
        \break \bar "||"
        
      }
    >>
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Clockwork"
    shortInstrumentName = #"Cl."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        %1
        r1 | r1 | r1 |
        r1 | r1 | r1 |
        
        \repeat unfold 4 {
          \repeat percent 3 {
            cis''8 d'' cis'' d'' cis'' d'' cis'' d'' |
          }
          \repeat percent 3 {
            cis''8 d'' cis'' d'' cis'' d'' cis'' d'' |
          }
        }
      }
    >>
    
  }
  
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Fire"
    shortInstrumentName = #"F."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        %1
        r1 | r1 | r1 |
        r1 | r1 | r1 |
        
        \repeat percent 3 {
          bes'4_\markup {"pizz." \draw-dashed-line #'(5 . 0)}\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
        }
        \repeat percent 3 {
          bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
        }
        
        \repeat unfold 2 {
          \repeat percent 3 {
            bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
          }
          \repeat percent 3 {
            bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
          }
        }
        
        \repeat percent 3 {
          bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
        }
        \repeat percent 2 {
          bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
        }
        bes'8 bes' bes' bes' bes' bes' bes' bes' |
      }
    >>
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Maker"
    shortInstrumentName = #"M."
  } {
    \set Staff.connectArpeggios = ##t
    % \partial 4
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \key g \major
        
        %interlude
        
        %1
        e4_\markup {"pizz." \draw-dashed-line #'(5 . 0) }\staccato e\staccato e\staccato e\staccato | 
        e4\staccato r2. |
        r1 |
        e4\staccato e\staccato e\staccato e\staccato | 
        e4\staccato r2. |
        r1 |
        
        \repeat percent 2 {
          e4\staccato e\staccato e\staccato e\staccato | 
          e4\staccato r2. |
          r1 |
        }
        
        \repeat percent 2 {
          e4\staccato e\staccato e\staccato e\staccato | 
          e4\staccato r2. |
          r1 |
        }
        
        \repeat percent 2 {
          e4\staccato e\staccato e\staccato e\staccato | 
          fis4\staccato fis\staccato fis\staccato fis\staccato |
          g4\staccato g\staccato g\staccato g\staccato |
        }
        
        \repeat percent 2 {
          e4_"nat." e e e | 
          fis4 fis fis fis |
          g4 g g g |
        }
      }
    >>
  }

>>



<<
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Child"
    shortInstrumentName = #"Ch."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \key fis \minor
  
        %1
        \fullcyclerest
        \break \bar "||"
  
        %2
        \fullcyclerest
        \break \bar "||"
  
        %3
        r1 r1 |
        e'''4. d'''8 cis'''4 d''' | cis'''2 b'' |
        d'''4. cis'''8 b''4 cis''' | b''2 ais'' |
        e'''4. d'''8 cis'''4 d''' | cis'''2 b'' |
        d'''4. cis'''8 b''4 cis''' | b''2 ais'' |
        \break \bar "||"
        
        %4
        e'''8 e''' e''' d''' cis''' cis''' d''' d''' | cis'''8 cis''' cis''' cis''' b'' b'' b'' b'' |
        d'''8 d''' d''' cis''' b'' b'' cis''' cis''' | b'' b'' b'' b'' ais'' ais'' ais'' ais'' |
        e'''8 e''' e''' d''' cis''' cis''' d''' d''' | cis'''8 cis''' cis''' cis''' b'' b'' b'' b'' |
        d'''8 d''' d''' cis''' b'' b'' cis''' cis''' | b'' b'' b'' b'' ais'' ais'' ais'' ais'' |
        \repeat tremolo 12 {e'''32^"trem."} \repeat tremolo 4 {d'''32} \repeat tremolo 8 {cis'''32} \repeat tremolo 8 { d'''32 } |
        \repeat tremolo 16 {cis'''32} \repeat tremolo 16 {b''32} |
        \break \bar "||"
        
        %5
        \repeat tremolo 12 {d'''32} \repeat tremolo 4 {cis'''32} \repeat tremolo 8 {b''32} \repeat tremolo 8 { cis'''32 } |
        \repeat tremolo 16 {b''32} \repeat tremolo 16 {ais''32} |
        \repeat tremolo 12 {e'''32^"div."} \repeat tremolo 4 {d'''32} \repeat tremolo 8 {cis'''32} \repeat tremolo 8 { d'''32 } |
        \repeat tremolo 16 {cis'''32} \repeat tremolo 16 {b''32} |
        \repeat tremolo 12 {d'''32} \repeat tremolo 4 {cis'''32} \repeat tremolo 8 {b''32} \repeat tremolo 8 { cis'''32 } |
        \repeat tremolo 16 {b''32} \repeat tremolo 16 {ais''32} |   
        \repeat tremolo 12 {e'''32} \repeat tremolo 4 {d'''32} \repeat tremolo 8 {cis'''32} \repeat tremolo 8 { d'''32 } |
        \repeat tremolo 16 {cis'''32} \repeat tremolo 16 {b''32} |
        \repeat tremolo 12 {d'''32} \repeat tremolo 4 {cis'''32} \repeat tremolo 8 {b''32} \repeat tremolo 8 { cis'''32 } |
        \repeat tremolo 16 {b''32} \repeat tremolo 16 {ais''32} |
        \break \bar "||"
        
        
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        
        %1
        \fullcyclespace
        
        %2
        \fullcyclespace
        
        %3
        \fullcyclespace
        
        %4
        \fullcyclespace
        
        %5
        s1 s1
        \repeat tremolo 12 {cis'''32} \repeat tremolo 4 {b''32} \repeat tremolo 8 {ais''32} \repeat tremolo 8 { b''32 } |
        \repeat tremolo 16 {ais''32} \repeat tremolo 16 {gis''32} |
        \repeat tremolo 12 {b''32} \repeat tremolo 4 {ais''32} \repeat tremolo 8 {gis''32} \repeat tremolo 8 { ais''32 } |
        \repeat tremolo 16 {gis''32} \repeat tremolo 16 {fisis''32} |
        \repeat tremolo 12 {cis'''32} \repeat tremolo 4 {b''32} \repeat tremolo 8 {ais''32} \repeat tremolo 8 { b''32 } |
        \repeat tremolo 16 {ais''32} \repeat tremolo 16 {gis''32} |
        \repeat tremolo 12 {b''32} \repeat tremolo 4 {ais''32} \repeat tremolo 8 {gis''32} \repeat tremolo 8 { ais''32 } |
        \repeat tremolo 16 {gis''32} \repeat tremolo 16 {fisis''32} |
      }
    >>
    
    %tumble2
    <<
      
      \context Voice { \voiceOne 
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        \repeat tremolo 12 {e'''32} \repeat tremolo 4 {d'''32} \repeat tremolo 12 {e'''32} \repeat tremolo 4 {d'''32} |
        \repeat tremolo 12 {e'''32} \repeat tremolo 4 {d'''32} \repeat tremolo 12 {e'''32} d'''8 |
        \break \bar "||"
      }
      \context Voice { \voiceTwo 
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        \repeat tremolo 12 {cis'''32} \repeat tremolo 4 {b''32} \repeat tremolo 12 {ais''32} \repeat tremolo 4 {gis''32} |
        \repeat tremolo 12 {fisis''32} \repeat tremolo 4 {f''32} \repeat tremolo 12 {e''32} d''8 |
        
      }
    >>
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Clockwork"
    shortInstrumentName = #"Cl."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        
        \key b \minor
  
        %1
        r1 r1 |
        \repeat percent 3 {
          e''8 d'' e'' d'' e'' fis'' e'' d'' | cis''8 b' cis'' b' cis'' b' ais' b' |
        }
        <e''>8^"div."[ <d''> <cis''>] <e''>[ <d''> <cis''>] <e''>[ <d''> |
        <cis''>8] <e''>[ <d''> <cis''>] <e''>[ <d''> <cis''> <b'>] |
        
        %2
        \repeat percent 4 {
          e''8 d'' e'' d'' e'' fis'' e'' d'' | cis''8 b' cis'' b' cis'' b' ais' b' |
        }
        <e''>8[ <d''> <cis''>] <e''>[ <d''> <cis''>] <e''>[ <d''> |
        <cis''>8] <e''>[ <d''> <cis''>] <e''>[ <d''> <cis''> <b'>] |
        
        %3 4 5
        \repeat unfold 3 {
          \repeat percent 5 {
            <e''>8[ <d''> <cis''>] <e''>[ <d''> <cis''>] <e''>[ <d''> |
            <cis''>8] <e''>[ <d''> <cis''>] <e''>[ <d''> <cis''> <b'>] |
          }
        }
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
  
        %1
        \repeat unfold 8 s1 |
        <g'>8[ <fis'> <e'>] <g'>[ <fis'> <e'>] <g'>[ <fis'> |
        <e'>8] <g'>[ <fis'> <e'>] <g'>[ <fis'> <e'> <d'>] |
        
        %2
        \repeat percent 4 {
          g'8 fis' g' fis' g' a' g' fis' | e'8 d' e' d' e' d' cis' d' |
        }
        <g'>8[ <fis'> <e'>] <g'>[ <fis'> <e'>] <g'>[ <fis'> |
        <e'>8] <g'>[ <fis'> <e'>] <g'>[ <fis'> <e'> <d'>] |
        
        %3 4 5
        \repeat unfold 3 {
          \repeat percent 5 {
            <g'>8[ <fis'> <e'>] <g'>[ <fis'> <e'>] <g'>[ <fis'> |
            <e'>8] <g'>[ <fis'> <e'>] <g'>[ <fis'> <e'> <d'>] |
          }
        }
      }
    >>
    
    %tumble2
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        r1 | r1 |
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        s1 | s1 |
      }
    >>
  }
  
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Fire"
    shortInstrumentName = #"F."
  } {
    \set Staff.connectArpeggios = ##t
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
          
        %1
        \fullcyclerest
  
        %2 3 4 5
        \repeat unfold 4 {
          \repeat percent 2 {
            <des' ges' bes' ces''>8\staccato r4 <des' ges' bes' ces''>8\staccato r4 <des' ges' bes' ces''>4\staccato |
            <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>4\staccato |
            <des' ges' bes' eeses''>8\staccato r4 <des' ges' bes' eeses''>8\staccato r4 <des' ges' bes' eeses''>4\staccato |
            <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>4\staccato |
          }
          <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>8\staccato r4 <des' ges' bes' des''>4\staccato |
          <des' ges' bes' des''>8\staccato r4 <des' ges' bes' eeses''>8\staccato r4 <des' ges' bes' des''>4\staccato |
        }
      }
    >>
    
    %tumble2
    <<
      \context Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        r1 | r1 |
      }
    >>
  }
  \new Staff \with {
    \consists "Span_arpeggio_engraver"
    instrumentName = #"Maker"
    shortInstrumentName = #"M."
  } {
    \set Staff.connectArpeggios = ##t
    % \partial 4
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        \key e \minor
        
        %1 2 3 4 5
        \repeat unfold 5 {
          \repeat percent 2{
          <e bes>4 <e bes>8 <e bes>4 <e bes>8 <e bes>4 |
          <fis bes>4 <fis bes>8 <fis bes>4 <fis bes>8 <fis bes>4 |
          <g bes>4 <g bes>8 <g bes>4 <g bes>8 <g bes>4 |
          <fis bes>4 <fis bes>8 <fis bes>4 <fis bes>8 <fis bes>4 |
          }
          <e bes>4 <e bes>8 <e ces'>4 <e ces'>8 <e des'>4 |
          <e des'>4 <e des'>8 <e ces'>4 <e ces'>8 <e bes>4 |
        }
      }
    >>
    
    <<
      \context Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
        
        %tumble2
        r1 | r1 |
      }
    >>
  }

>>