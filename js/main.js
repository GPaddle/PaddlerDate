
// Credit https://github.com/wass08/cupidindon
const STYLE_CLASS = {
  'PROFILE_NEXT': 'profile-next',
  'PROFILE_MATCH': 'profile-match',
  'PROFILE_BACK': 'profile-back',
  'PRISTINE': 'pristine'
}


function setupDragAndDrop(profile) {
  const hammertime = new Hammer(profile);

  const MAX_ANGLE = 42;
  const SMOOTH = 0.3;
  const THRESHOLD = 42;
  const THRESHOLD_MATCH = 150;

  hammertime.on('pan', function (e) {
    resetStyle();

    let posX = e.deltaX;
    let posY = Math.max(0, Math.abs(posX * SMOOTH) - THRESHOLD);
    let angle = Math.min(Math.abs(posX * SMOOTH / 100), 1) * MAX_ANGLE;

    if (posX < 0) {
      angle *= -1;
    }

    profile.style.transform = `translateX(${posX}px) translateY(${posY}px) rotate(${angle}deg)`;

    if (posX > THRESHOLD_MATCH) {
      profile.classList.add(STYLE_CLASS['PROFILE_MATCH'] + 'ing');
    } else if (posX < -THRESHOLD_MATCH) {
      profile.classList.add(STYLE_CLASS['PROFILE_NEXT'] + 'ing');
    }

    if (!e.isFinal) {
      return
    }

    profile.style.transform = ``;

    if (posX > THRESHOLD_MATCH) {
      profile.classList.add(STYLE_CLASS['PROFILE_MATCH']);
    } else if (posX < -THRESHOLD_MATCH) {
      profile.classList.add(STYLE_CLASS['PROFILE_NEXT']);
    } else {
      profile.classList.add(STYLE_CLASS['PROFILE_BACK']);
    }

    function resetStyle() {
      profile.classList.remove(STYLE_CLASS['PRISTINE']);
      profile.classList.remove(STYLE_CLASS['PROFILE_BACK']);
      profile.classList.remove(STYLE_CLASS['PROFILE_MATCH'] + 'ing');
      profile.classList.remove(STYLE_CLASS['PROFILE_NEXT'] + 'ing');
    }
  });
}


const template = function (data) {
  return `
<div class="profile ${STYLE_CLASS['PRISTINE']}";">
  <div class="profile__image" style="background-image: url('${data['imageURL']}');"></div>
  <div class="profile__infos">
    <div class="profile__name">${data['name']}</div><div class="profile__age">${new Date().getFullYear() - new Date(data['birthDate']).getFullYear()} ans</div>
    <ul class="profile__description">
      ${data['awards'].reduce((previousAward, award) => previousAward + `<li>${award}</li>`)}  
    </ul>
  </div>
</div>
`}

const url = `data/data.json`
const params = {
  headers: {
    "content-type": "application/json; charset=UTF-8"
  }
}

fetch(url, params)
  .then(data => { return data.json() })
  .then(res => {
    data = res.sort((a, b) => .5 - Math.random())

    data.forEach(datum => {
      document.querySelector('.profiles').innerHTML += template(datum);
    });

    let profiles = document.querySelectorAll('.profile');

    profiles.forEach(setupDragAndDrop);

    document.querySelector('#LikeButton').addEventListener('click', () => applySelection(STYLE_CLASS['PROFILE_MATCH']))
    document.querySelector('#NextButton').addEventListener('click', () => applySelection(STYLE_CLASS['PROFILE_NEXT']))

  }).catch(function (error) {
    console.error(error)
  })

function applySelection(profileTargetState) {
  let pristineProfiles = document.querySelectorAll(`.profile.${STYLE_CLASS['PRISTINE']}`);

  const targetProfile = pristineProfiles[pristineProfiles.length - 1];
  if (!targetProfile) {
    return
  }

  targetProfile.classList.add(profileTargetState);
  targetProfile.classList.add(profileTargetState + 'ing');
  targetProfile.classList.remove(STYLE_CLASS['PRISTINE']);
}

