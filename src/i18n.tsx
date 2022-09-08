import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Welcome": "Welcome",
      "TELL US ABOUT YOURSELF": "TELL US ABOUT YOURSELF",
      "Full Name": "Full Name",
      "Name Surname": "Name Surname",
      "Email": "Email",
      "Photo": "Photo",
      "Orion Start Day": "Orion Start Day",
      "Position":"Position",
      "Department":"Department",
      "University":"University",
      "Graduation":"Graduation",
      "Previous Job":"Previous Job",
      "Total Experience":"Total Experience",
      "Technical Skills":"Technical Skills",
      "About":"About",
      "Submit":"Submit",
      "Admin Panel": "Admin Panel",
      "Form List": "Form List",
      "Open this select menu": "Open this select menu",
      "ex: NRD2208": "ex: NRD2208",
      "ex: Corban University": "ex: Corban University",
      "ex: Corporate consulting": "ex: Corporate consulting",
      "ex: Backend Developer": "ex: Backend Developer",
      "ex: 2 years ": "ex: 2 years ",
      " ex: PHP, Vue.js, AWS..": " ex: PHP, Vue.js, AWS..",

      'Username is required': 'Username is required',
      'Password is required': 'Password is required',
      'Login failed! Wrong username or password.': 'Login failed! Wrong username or password.',
      "LOG IN": "LOG IN",
      "ACCESSING THE USER LIST": "ACCESSING THE USER LIST",
      "Back": "Back",
      "Username": "Username",
      "Password": "Password",
      "Login": "Login",

      "Current Photo": "Current Photo",
      "Click to update photo": "Click to update photo",
      "Update": "Update",

      "View Form": "View Form",
      "View Data Saved to Form": "View Data Saved to Form",
      "Update Form": "Update Form",
      "Delete Form": "Delete Form",      
      "Form Management": "Form Management",
      "WELCOME": "WELCOME",
      "Search...": "Search...",
      "New Form": "New Form",
      "Account Management": "Account Management",
      "Sign Out": "Sign Out",
      "Loading...": "Loading...",

      "EDIT YOUR DESIGN": "EDIT YOUR DESIGN",
      "Form Name": "From Name",
      "Choose a color": "Choose a color",
      "Choose a photo": "Choose a photo",
      "Form Description": "Form Description",
      "Add": "Add",
      "Type": "Type",
      "Domain Name": "Domain Name",
      "Hint": "Hint", 
      "Max:": "Max:",
      "Required Field": "Required Field",
      "Save": "Save",
      "Create Form": "Create Form",
      "DYNAMIC FORM DESIGN": "DYNAMIC FORM DESIGN",
      "Account Creation and Authorization": "Account Creation and Authorization",
      "ADMIN ACCOUNT AND PERMISSIONS": "ADMIN ACCOUNT AND PERMISSIONS",
      "Username Assignment": "Username Assignment",
      "Password Assignment": "Password Assignment",
      "Determine Form and Authorizations": "Determine Form and Authorizations",
      "The Account": "The account you have created; You can associate it with more than one form, as well as perform authorization within the form. If you don't choose, you create an account with access to all forms. You can also perform authorization in a selected form.",
      "Form Assignment": "Form Assignment",
      "Choose Form": "Choose Form",
      "Authorization": "Authorization",
      "Choose authorization": "Choose authorization",
      "Can see. (Listing)": "Can see. (Listing)",
      "It can operate. (Listing/Updating/Deleting)": "It can operate. (Listing/Updating/Deleting)",
      "Customize Authority": "Customize Authority",
      "Authorize In The Form": "Authorize In The Form",
      "Select a field for the form.": "Select a field for the form.",
      "Assigning a Value to an Authorized Field": "Assigning a Value to an Authorized Field",
      "The authorization cannot be customized without making a form selection.": "The authorization cannot be customized without making a form selection.",
      "Delete": "Delete",

      "ACCESSING PANEL": "ACCESSING PANEL",
      'Are you sure?': 'Are you sure?',
      'The selected forms will be deleted!': 'The selected forms will be deleted!',
      "Datas": "Datas",
      "When you open this setting, you can update it by double-clicking on the desired field": "When you open this setting, you can update it by double-clicking on the desired field",
      "Turn back": "Turn back",
    }
  },
  tr: {
    translation: {
      "Welcome": "Hoşgeldiniz",
      "TELL US ABOUT YOURSELF": "BİZE KENDİNDEN BAHSET",
      "Full Name": "Ad Soyad",
      "Name Surname": "Ad Soyad",
      "Email": "Email",
      "Photo": "Fotoğraf",
      "Orion Start Day": "Orion Başlangıç Günü",
      "Position":"Pozisyon",
      "Department":"Departman",
      "University":"Universite",
      "Graduation":"Mezuniyet",
      "Previous Job":"Önceki iş",
      "Total Experience":"Toplam Tecrübe",
      "Technical Skills":"Teknik beceriler",
      "About":"Hakkında",
      "Submit":"Gönder",
      "Admin Panel": "Admin Paneli",
      "Form List": "Form Listesi",
      "Open this select menu":"Bu seçim menüsünü aç",
      'Username is required': 'Kullanıcı adı gereklir',
      'Password is required': 'Şifre gereklidir',
      'Login failed! Wrong username or password.': 'Giriş başarısız! Yanlış kullanıcı adı ya da şifre.',
      "LOG IN": "GİRİŞ YAP",
      "ACCESSING THE USER LIST": "KULLANICI LİSTESİNE ERİŞİM",
      "Back": "Geri Dön",
      "Username": "Kullanıcı Adı",
      "Password": "Şifre",
      "Login": "Giriş yap",
      "Current Photo" : "Güncel fotoğraf",
      "Click to update photo": "Fotoğrafı güncellemek için tıklayın",
      "Update": "Güncelle",
      "View Form": "Formu Gör",
      "View Data Saved to Form": "Forma Kayıtlı Verileri Gör",
      "Update Form": "Formu Güncelle",
      "Delete Form": "Formu Sil",      
      "Form Management": "Form Yönetimi",
      "WELCOME": "HOŞGELDİN",
      "Search...": "Arama...",
      "New Form": "Yeni Form",
      "Account Management": "Hesap Yönetimi",
      "Sign Out": "Hesaptan Çık",
      "Loading...": "Yükleniyor...",
      "EDIT YOUR DESIGN": "TASARIMINI DÜZENLE",
      "Form Name": "Form Adı",
      "Choose a color": "Bir renk seçiniz",
      "Choose a photo": "Fotoğraf Seçiniz",
      "Form Description": "Form Açıklaması",
      "Add": "Ekle",
      "Type": "Tür",
      "Domain Name": "Alan Adı",
      "Hint": "İpucu",
      "Max:": "Maks:",
      "Required Field": "Zorunlu Alan",
      "Save": "Kaydet",
      "Create Form": "Form Oluştur",
      "DYNAMIC FORM DESIGN": "DİNAMİK YAPIDA FORM TASARIMI",
      "Account Creation and Authorization": "Hesap Oluşturma ve Yetkilendirme",
      "ADMIN ACCOUNT AND PERMISSIONS":"ADMİN HESABI VE İZİNLERİ",
      "Username Assignment": "Kullanıcı Adı Atama",
      "Password Assignment": "Şifre Atama",
      "Determine Form and Authorizations": "Form ve Yetkilerini Belirle",
      "The Account": "Oluşturuduğunuz hesabı; birden çok form ile ilişkilendirebilir, aynı zamanda form içinde yetkilendirme işlemi gerçekleştirebilirsiniz. Seçim yapmadığınız takdirde tüm formlara erişimi olan bir hesap oluşturursunuz. Aynı zamanda seçilen bir form içinde de yetkilendirme işlemi gerçekleştirebilirsiniz.",
      "Form Assignment": "Form Atama",
      "Choose Form": "Form Seç",
      "Authorization": "Yetkilendirme",
      "Choose authorization": "Yetki seç",
      "Can see. (Listing)": "Görebilir. (Listeleme)",
      "It can operate. (Listing/Updating/Deleting)": "İşlem yapabilir. (Listeleme/Güncelleme/Silme)",
      "Customize Authority": "Yetkiyi Özelleştir",
      "Authorize In The Form": "Form İçinde Yetkilendir",
      "Select a field for the form.": "Forma ait bir alan seçiniz.",
      "Assigning a Value to an Authorized Field": "Yetkili Alana Değer Atama",
      "The authorization cannot be customized without making a form selection.": "Form seçimi yapmadan yetki özelleştirilemez.",
      "Delete": "Sil",
      "ex: NRD2208": "ör: NRD2208",
      "ex: Corban University": "ör: Corban Universitesi",
      "ex: Corporate consulting":"ör: Kurumsal danışmanlık",
      "ex: Backend Developer": "ör: Backend Developer",
      "ex: 2 years ": "ör: 2 yıl ",
      " ex: PHP, Vue.js, AWS..": " ör: PHP, Vue.js, AWS..",
      "ACCESSING PANEL": "ERİŞİM PANELİ",
      'Are you sure?': 'Emin misin?',
      'The selected forms will be deleted!': 'Seçilen formlar silinecektir!',
      "Datas": "Verileri",
      "When you open this setting, you can update it by double-clicking on the desired field": "Bu ayarı açtığınızda istediğiniz alana çift tıklayarak güncelleyebilirsiniz",
      "Turn back": "Geri dön",

    }
  }
};

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: "en", 

    interpolation: {
      escapeValue: false 
    }
  });

  export default i18n;