document.addEventListener('DOMContentLoaded', () => {
  const getInterests = () => JSON.parse(localStorage.getItem('ecoInterests') || '[]');

  const setButtonState = (button, interested) => {
    button.textContent = interested ? 'Tirar Interesse' : 'Tenho interesse';
    button.classList.toggle('red', interested);
    button.classList.toggle('blue', !interested);
  };

  const applyInterestFilter = () => {
    const selectedFilter = document.querySelector('[data-filter]:checked');
    if (!selectedFilter) return;

    document.querySelectorAll('.catalog-row').forEach(row => {
      const show = selectedFilter.value !== 'interested' || row.dataset.interested === 'true';
      row.classList.toggle('hidden', !show);
    });
  };

  const interests = getInterests();

  document.querySelectorAll('[data-interest]').forEach(button => {
    const id = button.dataset.interest;
    const row = button.closest('.catalog-row');
    const interested = interests.includes(id);

    setButtonState(button, interested);
    if (row) row.dataset.interested = String(interested);

    button.addEventListener('click', () => {
      const currentInterests = getInterests();
      const index = currentInterests.indexOf(id);
      const nowInterested = index === -1;

      if (nowInterested) {
        currentInterests.push(id);
      } else {
        currentInterests.splice(index, 1);
      }

      localStorage.setItem('ecoInterests', JSON.stringify(currentInterests));
      setButtonState(button, nowInterested);
      if (row) row.dataset.interested = String(nowInterested);
      applyInterestFilter();
    });
  });

  document.querySelectorAll('[data-filter]').forEach(radio => {
    radio.addEventListener('change', applyInterestFilter);
  });

  applyInterestFilter();

  const productForm = document.getElementById('productForm');
  if (productForm) {
    productForm.addEventListener('submit', event => {
      event.preventDefault();
      alert('Produto salvo com sucesso!');
      window.location.href = 'meus-produtos.html';
    });
  }

  const acceptButton = document.getElementById('acceptOfferButton');
  const rejectButton = document.getElementById('rejectOfferButton');
  const result = document.getElementById('result');

  if (acceptButton && rejectButton && result) {
    acceptButton.addEventListener('click', () => {
      result.textContent = 'Proposta aceita. A troca ecológica foi estabelecida.';
      result.className = 'success';
    });

    rejectButton.addEventListener('click', () => {
      result.textContent = 'Proposta recusada.';
      result.className = 'error';
    });
  }
});
