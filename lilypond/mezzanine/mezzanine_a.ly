
mezzanine_one_a={
  \set Staff.connectArpeggios = ##t
  \time 3/4
  \key d \major
  \tempo 4=72
  <<
    \new Voice { \voiceOne
      \mark \markup { \circle "A" }
      
      R2. |
    }
  >>
}


mezzanine_two_a={
  \set Staff.connectArpeggios = ##t
  \tempo 4=72
  \key d \major
  \time 3/4
  <<
    \new Voice { \voiceOne
      \mark \markup { \circle "A" }
      
      R2. |
    }
  >>
}

mezzanine_three_a={
  \set Staff.connectArpeggios = ##t
  \tempo 4=72
  \key d \major
  \time 3/4
  <<
    \new Voice { \voiceOne
      \mark \markup { \circle "A" }
      
      a'8 cis'' b' e'' b' cis'' |
    }
    \new Voice { \voiceTwo
      \mark \markup { \circle "A" }
      
      a'4 s2 |
    }
  >>
}

mezzanine_four_a={
  \set Staff.connectArpeggios = ##t
  \tempo 4=72
  \key d \major
  \time 3/4
  <<
    \new Voice { \voiceOne
      \mark \markup { \circle "A" }
      
      R2. |
    }
  >>
}
