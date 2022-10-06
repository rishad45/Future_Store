
jQuery(document).ready(async ()=>{
    console.log("otp")
})
$("#createAddress").on('submit', async function (e) {
    e.preventDefault();
    let data = $("#createAddress").serialize()
    await axios.post('/saveAddress', data).then((res) => {
        $("#addressDiv").load(location.href + " #addressDiv");
    })
})


function editButton() {
    document.getElementById('editButton').setAttribute('hidden', '')
    document.getElementById('cancel').removeAttribute('hidden');
    document.getElementById('saveName').removeAttribute('hidden')
    let tags = document.getElementsByClassName('disable')
    for (var i = 0; i < tags.length; i++) {
        tags[i].removeAttribute('disabled');
        tags[i].style.cursor = 'pointer'
    }
}

function cancelButton() {
    document.getElementById('cancel').setAttribute('hidden', '')
    document.getElementById('editButton').removeAttribute('hidden')

    let tags = document.getElementsByClassName('disable')
    for (var i = 0; i < tags.length; i++) {
        tags[i].setAttribute('disabled', '')
        tags[i].style.cursor = 'not-allowed'
    }
    document.getElementById('saveName').setAttribute('hidden', '')
}

function emailEditButton() {
    document.getElementById('emailEdit').setAttribute('hidden', '')
    document.getElementById('emailcancel').removeAttribute('hidden')
    document.getElementById('emailSave').removeAttribute('hidden')
    let tags = document.getElementsByClassName('emailEditBox')
    for (var i = 0; i < tags.length; i++) {
        tags[i].removeAttribute('disabled');
        tags[i].style.cursor = 'pointer'
    }
}

function emailCancelButton() {
    document.getElementById('emailcancel').setAttribute('hidden', '')
    document.getElementById('emailEdit').removeAttribute('hidden')
    document.getElementById('emailSave').setAttribute('hidden', '')
    let tags = document.getElementsByClassName('emailEditBox')
    for (var i = 0; i <= tags.length; i++) {
        tags[i].setAttribute('disabled', '')
        tags[i].style.cursor = 'not-allowed'
    }
}

function editMobileButton() {
    document.getElementById('mobileEdit').setAttribute('hidden', '')
    document.getElementById('mobileEditCancel').removeAttribute('hidden')
    document.getElementById('saveMobile').removeAttribute('hidden')
    let tags = document.getElementsByClassName('mobileEditBox')
    for (var i = 0; i < tags.length; i++) {
        tags[i].removeAttribute('disabled')
        tags[i].style.cursor = 'pointer'
    }
}

function mobileCancelButton() {
    document.getElementById('mobileEditCancel').setAttribute('hidden', '')
    document.getElementById('mobileEdit').removeAttribute('hidden')
    document.getElementById('saveMobile').setAttribute('hidden', '')
    let tags = document.getElementsByClassName('mobileEditBox')
    for (var i = 0; i <= tags.length; i++) {
        tags[i].setAttribute('disabled', '')    
        tags[i].style.cursor = 'not-allowed'
    }
}

function deleteAddress(id) {
    $.ajax({
        url: '/removeAddress',
        data: {
            addressId: id
        },
        method: 'post'
    });
    $("#addressDiv").load(location.href + " #addressDiv")

};

async function saveName(id) {
    let data = {}
    let newName = document.getElementById('newName').value
    data.newName = newName
    data.id = id
    data.status = 'name'
    await axios.post('/saveChanges', data).then((res) => {
        $("#fullNameDiv").load(location.href + " #fullNameDiv")
    })
}



async function changeEmail(id) {
    let data = {}
    let newEmail = document.getElementById('newEmail').value
    data.newEmail = newEmail
    data.id = id
    data.status = 'email'
    await axios.post('/saveChanges', data).then((res) => {
        $("#emailDiv").load(location.href + " #emailDiv")
    })
}

async function changeMobile(id) {
    let data = {}
    let newMobile = document.getElementById('newMobile').value
    data.newMobile = newMobile
    data.id = id
    data.status = 'mobile'
    await axios.post('/saveChanges', data).then((res) => {
        $("#mobileDiv").load(location.href + " #mobileDiv") 
    })
}

// async function changePassword(id, mobile) {
//     console.log("fsdkfjdskfj")
//     // var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
//     //     keyboard: false
//     // })
//     // await createService("inn")
//     // myModal.show() 
// } 