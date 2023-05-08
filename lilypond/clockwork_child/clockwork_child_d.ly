% clockwork child, section D

child_d_one={
  \mark \markup \circle D
  R1*10 |
  R1*10 |
  
  g'''4. fis'''8 e'''4 g''' | fis'''2 cis'''2 |
  g'''4. fis'''8 e'''4 g''' | fis'''1 |
  g'''4. fis'''8 e'''4 g''' | fis'''2 cis'''2 |
  g'''4. fis'''8 e'''4 g''' | \repeat unfold 8 bes'''8 |
  \repeat tremolo 32 {bes'''32^"trem."} |
  \repeat tremolo 32 {b'''32^"trem."} |
  \solobreak \combinedbreak \bar "||" 
}

child_d_two={
  
}

clockwork_d_one={
  \mark \markup \circle D
  \solobreak
  \repeat percent 4 {
    e'8[ g' b']     e'[ g' b']     e'[ g'   | b']   e'[ g' b']     e'[ g' b' g'] |
  }
  e'8[ fis' ais'] e'[ fis' ais'] e'[ fis' | ais'] e'[ fis' ais'] e'[ fis' ais' fis'] |
  \solobreak \combinedbreak \bar "||" 
  
  R1*4 |
  \repeat percent 2 {
    e'8[ g' b']     e'[ g' b']     e'[ g'   | b']   e'[ g' b']     e'[ g' b' g'] |
  }
  e'8[ fis' ais'] e'[ fis' ais'] e'[ fis' | ais'] e'[ fis' ais'] e'[ fis' ais' fis'] |
  \solobreak \combinedbreak \bar "||" 
  
  \repeat percent 4 {
    e'8[ g' b']     e'[ g' b']     e'[ g'   | b']   e'[ g' b']     e'[ g' b' g'] |
  }
  e'8[ fis' ais'] e'[ fis' ais'] e'[ fis' | ais'] e'[ fis' ais'] e'[ fis' ais' fis'] |
  \solobreak \combinedbreak \bar "||" 
}

fire_d_one={
  \mark \markup \circle D
  \key c \major
  R1*10 |
  \combinedbreak \bar "||"
  
  R1*4 |
  \repeat unfold 2 {
    d''8 d'' r d'' r b' r g' |
    gis'8 gis' r gis' r b' r cis'' |
  }
  \repeat unfold 2 {
    cis''8 cis'' r cis'' r cis'' r cis'' |
  }
  \solobreak \combinedbreak \bar "||"
  
  \repeat unfold 4 {
    d''8 d'' r d'' r b' r g' |
    gis'8 gis' r gis' r b' r cis'' |
  }
  \repeat unfold 2 {
    cis''8 cis'' r cis'' r cis'' r cis'' |
  }
  \solobreak \combinedbreak \bar "||"
}

maker_d_one={
  \mark \markup \circle D
  R1*8
  e8_\< e e e e e e e | e e e e e e e e_\! 
  \solobreak \combinedbreak \bar "||"
  \repeat unfold 2 {
    \repeat percent 8 {
      <e b>4 <e b>8 <g b>4 <g b>8 <g b>4 |
    }
    \repeat unfold 2 {
      <fis des'>4 <fis des'>8 <bes des'>4 <bes des'>8 <bes des'>4 |
    }
    \combinedbreak \bar "||"
  }
  \solobreak \combinedbreak \bar "||"
}