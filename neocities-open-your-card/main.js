let currentStep = 1;
let selectedShape = "rectangle";

const imageInput = document.getElementById("imageInput");
const fileName = document.getElementById("fileName");
const step4Image = document.getElementById("step4Image");
const miniPreviewPlaceholder = document.getElementById("miniPreviewPlaceholder");
const shapeButtons = document.querySelectorAll(".shape-btn");

shapeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedShape = button.dataset.shape;
    document.getElementById("cardShape").value = selectedShape;
    shapeButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
  });
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files && imageInput.files[0];
  if (!file) {
    fileName.textContent = "No image selected yet.";
    step4Image.removeAttribute("src");
    step4Image.style.display = "none";
    miniPreviewPlaceholder.style.display = "block";
    return;
  }

  fileName.textContent = file.name;
  step4Image.src = URL.createObjectURL(file);
  step4Image.style.display = "block";
  miniPreviewPlaceholder.style.display = "none";
});

function goNext(step) {
  if (step === 1 && (!imageInput.files || !imageInput.files[0])) {
    alert("Please upload an image first.");
    return;
  }

  document.getElementById("step-" + step).classList.add("hidden");
  currentStep = step + 1;
  document.getElementById("step-" + currentStep).classList.remove("hidden");
  updateSteps();
}

function goBack(step) {
  document.getElementById("step-" + step).classList.add("hidden");
  currentStep = step - 1;
  document.getElementById("step-" + currentStep).classList.remove("hidden");
  updateSteps();
}

function updateSteps() {
  for (let i = 1; i <= 4; i += 1) {
    const dot = document.getElementById("dot-" + i);
    if (dot) dot.classList.toggle("active", i === currentStep);
  }
}

function createCard() {
  const file = imageInput.files && imageInput.files[0];
  if (!file) return alert("Please upload an image first.");

  const reader = new FileReader();
  reader.onload = () => {
    const id = Math.random().toString(36).slice(2, 10);

    const cardData = {
      image: reader.result,
      message: (document.getElementById("cardMessage")?.value || "").trim(),
      musicURL: (document.getElementById("musicURL")?.value || "").trim(),
      musicStart: Number(document.getElementById("musicStart")?.value || 0),
      colorTheme: document.querySelector("input[name='colorTheme']:checked")?.value || "blue",
      cardShape: selectedShape
    };

    localStorage.setItem("card_" + id, JSON.stringify(cardData));

    const viewerURL = new URL("viewer.html", window.location.href);
    viewerURL.hash = id;

    const shareLink = document.getElementById("shareLink");
    if (shareLink) shareLink.value = viewerURL.toString();

    document.getElementById("step-4")?.classList.add("hidden");
    document.getElementById("share-section")?.classList.remove("hidden");
  };

  reader.readAsDataURL(file);
}

function copyLink() {
  const input = document.getElementById("shareLink");
  if (!input) return;
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value).then(() => alert("Link copied.")).catch(() => {
    document.execCommand("copy");
    alert("Link copied.");
  });
}

function shareToFriends() {
  const link = document.getElementById("shareLink")?.value;
  if (!link) return alert("Create your card first.");

  if (navigator.share) {
    navigator.share({
      title: "Snoopy Flip E-Card",
      text: "I made you a Snoopy card",
      url: link
    }).catch(() => {});
  } else {
    copyLink();
  }
}

function viewCard() {
  const link = document.getElementById("shareLink")?.value;
  if (link) window.open(link, "_blank");
}
