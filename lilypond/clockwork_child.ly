\version "2.20.0"
\header {
  title = "Maker Fire Clockwork Child"
  composer = "John Asmuth"
  tagline = ""
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)

detuning_tail = {
  e8 e e e e e e | e e e e e e e e |
  dis8 dis dis dis dis dis dis dis | dis dis dis dis dis dis dis dis |
  
  e8 e e e e e e e | e e e e e e e e |
  dis dis dis dis dis dis dis dis | dis dis dis dis dis dis dis dis |
  
  cis8 cis cis cis cis cis cis cis | cis cis cis cis cis cis cis cis |
  dis dis dis dis dis dis dis dis | dis dis dis dis dis dis dis dis |
}

detuning_instructions = {
  <e-0>8-"open string, detuning, retuning"
  \detuning_tail
}

detuning_csharp = {
  e8-\markup{ "leave" \circle 6 "on C-sharp if preferred" }
  \detuning_tail
}

detuning = {
  e8
  \detuning_tail
}

bflatstoking = { bes'8\staccato r4 bes'8\staccato r4 bes'8\staccato r | }

fullcyclerest = { 
  r1 r1 r1 r1 |
  r1 r1 r1 r1 |
  r1 r1 r1 r1 |
}

<<
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Child"
  shortInstrumentName = #"Ch."
}
{
  \tempo 4 = 100
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \fullcyclerest
      
      \break
      
      \fullcyclerest
      
      \break
      
      \fullcyclerest
      
      \break
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
  >>
}
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Clockwork"
  shortInstrumentName = #"Cl."
}
{
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \fullcyclerest
      
      \fullcyclerest
      
      bes'8[ aes' e'] bes'[ aes' e'] r4 | bes'8[ aes' e'] bes'[ aes' e'] r4 |
      bes'8[ g' dis'] bes'[ g' dis'] r4 | bes'8[ g' dis'] bes'[ g' dis'] r4 |
      bes'8[ aes' e'] bes'[ aes' e'] r4 | bes'8[ aes' e'] bes'[ aes' e'] r4 |
      bes'8[ g' dis'] bes'[ g' dis'] r4 | bes'8[ g' dis'] bes'[ g' dis'] r4 |
      bes'8[ g' cis'] bes'[ g' cis'] r4 | bes'8[ g' cis'] bes'[ g' cis'] r4 |
      bes'8[ g' dis'] bes'[ g' dis'] r4 | bes'8[ g' dis'] bes'[ g' dis'] r4 |
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
  >>
}
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Fire"
  shortInstrumentName = #"F."
}
{
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \fullcyclerest
      
      \bflatstoking \bflatstoking \bflatstoking \bflatstoking
      \bflatstoking \bflatstoking \bflatstoking \bflatstoking
      \bflatstoking \bflatstoking \bflatstoking \bflatstoking
       
      \bflatstoking \bflatstoking \bflatstoking \bflatstoking
      \bflatstoking \bflatstoking \bflatstoking \bflatstoking
      \bflatstoking \bflatstoking \bflatstoking \bflatstoking
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
  >>
}
\new Staff \with {
  \consists "Span_arpeggio_engraver"
  instrumentName = #"Maker"
  shortInstrumentName = #"M."
}
{
  \set Staff.connectArpeggios = ##t
  % \partial 4
  \key a \minor
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      
      \detuning_instructions
      \detuning
      \detuning_csharp
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
  >>
}

>>