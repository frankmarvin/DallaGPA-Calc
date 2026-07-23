import { api } from './client';

export const transcriptApi = {
  getTranscript: () =>
    api.get('/transcript').then((res) => res.data),

  downloadPDF: async () => {
    const response = await api.get('/transcript/pdf', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transcript.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  printTranscript: () => window.print(),
};
