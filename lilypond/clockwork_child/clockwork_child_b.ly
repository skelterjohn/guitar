% clockwork child, section B

child_b_two={
  \mark \markup \circle B
  %1
  R1*5 | r2.. e'''16 e''' |
  \combinedbreak \bar "||"
  
  e'''4~ e'''8 d'''8\staccato r2 | R1*4 | r2.. e'''16 e''' |
  \combinedbreak \bar "||"
  
  e'''4~ e'''8 d'''8\staccato r2 | R1*4 | r2.. e'''16 e''' |
  \solobreak \combinedbreak \bar "||"
  
  e'''4~ e'''8 d'''8\staccato r2 | R1*4 | r2.. e'''16 e''' |
  \combinedbreak \bar "||"
  
  e'''4~ e'''8 d'''8\staccato r2 | R1*5 |
  \solobreak \combinedbreak \bar "||" 
}

clockwork_b_one={
  \mark \markup \circle B
  %1
  R1*6 |
  \combinedbreak \bar "||"
  
  \repeat percent 3 {
    <cis''\3>8 <d''\2> cis'' d'' cis'' d'' cis'' d'' |
  }
  \repeat percent 3 {
    cis''8 d'' cis'' d'' cis'' d'' cis'' d'' |
  }
  \combinedbreak \bar "||"
  \solobreak
  
  \repeat unfold 2 {
    \repeat percent 3 {
      cis''8 d'' cis'' d'' cis'' d'' cis'' d'' |
    }
    \repeat percent 3 {
      cis''8 d'' cis'' d'' cis'' d'' cis'' d'' |
    }
    \combinedbreak \bar "||"
    \solobreak
  }

  \repeat percent 3 {
    cis''8 d'' cis'' d'' cis'' d'' cis'' d'' |
  }
  cis''8_\< d'' cis'' d'' cis'' d'' cis'' d'' |
  cis''8 d'' cis'' d'' cis'' d'' cis'' d'' |
  cis''8 d'' cis'' d'' cis'' d'' cis'' d''_\! |
  \combinedbreak \bar "||"
  \solobreak
}

fire_b_one={
  \mark \markup \circle B
  %1
  R1*6 |
  
  \repeat percent 3 {
    bes'4_\markup {"pizz." \draw-dashed-line #'(5 . 0)}\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
  }
  \repeat percent 3 {
    bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
  }
  \combinedbreak \bar "||"
  
  \repeat unfold 2 {
    \repeat percent 3 {
      bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
    }
    \repeat percent 3 {
      bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
    }
    \combinedbreak \bar "||"
    \solobreak
  }
  
  \repeat percent 3 {
    bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
  }
  \repeat percent 2 {
    bes'4\staccato bes'8\staccato bes'4\staccato bes'8\staccato bes'4\staccato | 
  }
  bes'8_\< bes' bes' bes' bes' bes' bes' bes'_\! |
  \combinedbreak \bar "||"
  \break
}

maker_b_one={
  \mark \markup \circle B
  %1
  e4_\markup {"pizz." \draw-dashed-line #'(5 . 0) }_\p\staccato e\staccato e\staccato e\staccato | 
  e4\staccato r2. |
  R1 |
  e4\staccato e\staccato e\staccato e\staccato | 
  e4\staccato r2. |
  R1 |
  \combinedbreak \bar "||"
  \solobreak
  
  \repeat unfold 2 {
    e4\staccato e\staccato e\staccato e\staccato | 
    e4\staccato r2. |
    R1 |
  }
  \combinedbreak \bar "||"
  \solobreak
  
  \repeat unfold 2 {
    e4\staccato e\staccato e\staccato e\staccato | 
    e4\staccato r2. |
    R1 |
  }
  \combinedbreak \bar "||"
  \solobreak
  
  \repeat unfold 2 {
    e4\staccato e\staccato e\staccato e\staccato | 
    fis4\staccato fis\staccato fis\staccato fis\staccato |
    g4\staccato g\staccato g\staccato g\staccato |
  }
  \combinedbreak \bar "||"
  \solobreak
  
  e4\staccato e\staccato e\staccato e\staccato | 
  fis4\staccato fis\staccato fis\staccato fis\staccato |
  g4\staccato g\staccato g\staccato g\staccato |
  e4_"nat."_\< e e e | 
  fis4 fis fis fis |
  g4 g g g_\! |
  \combinedbreak \bar "||"
  \solobreak
}